import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import { VisitorService } from 'src/visitor/visitor.service';
import { Chat } from './entities/chat.entity';
import { Model } from 'mongoose';
import { ChatMessage } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly roomService: RoomService,
        private readonly visitorService: VisitorService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>) { }


    private async saveMessage(chatPayload: ChatMessage) {
        await this.chatModel.create(chatPayload)
    }

    private async deleteChat(room:string) {
        await this.chatModel.deleteMany({
            room:room
        })
    }
    async handleConnection(io: Server, socket: Socket) {
        console.log(`Client Connected: ${socket.id}`);
        //if it has token, it means its a customer representative
        if (socket.handshake.query.token) {
            //join room
            let visitors = await this.visitorService.getVisitors()
            io.emit('available-users', { visitors })
        }
        //  else {
        //     //boradcast this to the CR sockets
        //     console.log('in else')
        //     await this.visitorService.addVisitor(socket.id)
        //     io.emit('new-user', { client: socket.id })
        // }
    }
    async connectVisitor(io: Server, socket: Socket,data:{visitorId:string}) {
      
            //boradcast this to the CR sockets
            await this.visitorService.addVisitor(data.visitorId)
            io.emit('new-user', { visitorId: data.visitorId })
        
    }
    
    async acceptUser(io: Server, socket: Socket, data: { visitorId: string , representativeId:string}): Promise<void> {
      let response =  await this.roomService.create({ name: `${data.representativeId}_${data.visitorId}`, visitorId: data.visitorId, representativeId: data.representativeId })
        await this.visitorService.updateVisitor(data.visitorId, false)
        socket.join(response.payload._id)
        io.emit('available-users', { visitors: await this.roomService.getVisitors() })
        socket.to(data.visitorId).emit('join-room-request', { representative: data.representativeId, room: response.payload._id })
        socket.emit('join-room-request', { room: response.payload._id })
    }

    joinRoom(socket: Socket, room: string) {
        socket.join(room)
    }

    async sendMessage(socket: Socket, data: { from:string,to: string, message: string }) {
        await this.saveMessage({
            message: data.message,
            from: data.from,
            room: data.to
        })
        socket.to(data.to).emit("message", { message: data.message })
    }

    async getRooms(socket: Socket,data:{representativeId:string}) {
        let rooms = await this.roomService.findAll(data.representativeId)
        socket.to(data.representativeId).emit('rooms', { rooms })
    }

  
    async getRoom(socket: Socket,data:{room:string}){
           let history = await this.chatModel.find({room:data.room})
           socket.emit("chat-history",{history}) 
        }
    async endCall(socket: Socket, data) {
        await this.deleteChat(data.room);
        socket.to(data.visitorId).emit('chat-ended',{})
    }

    leaveRoom(socket: Socket, data) {
        socket.leave(data.roomId)
    }
    async handleDisconnect(io: Server, socket: Socket) {
        console.log(`socket Disconnected: ${socket.id}`);
        if (socket.handshake.query.token) {
            //join room
            let visitors = await this.visitorService.updateVisitors(socket.id)
            io.emit('available-users', { visitors })
            console.log(socket.rooms, 'all the rooms in CR')
        } else {
            //boradcast this to the CR sockets
            console.log('in remove visitor')
            let room = await this.visitorService.removeVisitor(socket.id)
            io.to(room?.representativeId).emit("leave-room-request", { roomId:room.name })
            console.log(socket.rooms, 'all the rooms in user')
            let visitors = await this.visitorService.getVisitors()
            io.emit('available-users', { visitors })
        }
    }
}