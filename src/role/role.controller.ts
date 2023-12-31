import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe ,UseGuards} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@ApiTags('Role Module')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  // @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.roleService.create(createRoleDto);
  // }
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.roleService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(id);
  // }
}
