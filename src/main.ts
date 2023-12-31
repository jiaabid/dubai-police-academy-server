import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { BannerModule } from './banner/banner.module';
import { AboutUsModule } from './about-us/about-us.module';
import { SchoolModule } from './school/school.module';
import { PageModule } from './page/page.module';
import { SectionModule } from './section/section.module';
import { EventModule } from './event/event.module';
import { AssetModule } from './asset/asset.module';
import { ServiceModule } from './service/service.module';
import { ValueModule } from './value/value.module';
import { HomepageModule } from './homepage/homepage.module';
import { VoteModule } from './vote/vote.module';
import { TopStudentsModule } from './top-students/top-students.module';
import { CounterModule } from "./counter/counter.module";
import { PartnersModule } from "./partners/partners.module";
import { NewsModule } from "./news/news.module";
import { ContactformModule } from './contactform/contactform.module';
import { CommanderModule } from 'src/commander/commander.module';

// import { DefaultEntities } from './utils/initial-script.utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Chat App')
    .setDescription('Chat App API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [
      RoleModule,
      UserModule,
      BannerModule,
      AboutUsModule,
      SchoolModule,
      PageModule,
      SectionModule,
      EventModule,
      AssetModule,
      ServiceModule,
      ValueModule,
      HomepageModule,
      VoteModule,
      CommanderModule,
      TopStudentsModule,
      CounterModule,
      PartnersModule,
      NewsModule,
      ContactformModule,
      CommanderModule,
    ],
  });
  SwaggerModule.setup('apis', app, document);

  await app.listen(3002);
}
bootstrap();
