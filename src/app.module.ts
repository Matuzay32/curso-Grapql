import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
//comment
@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath:[`.env.stage.${process.env.STAGE}`]
      }),
    TasksModule,TypeOrmModule.forRoot({type:"postgres",
  host:"localhost",
  port:5432,
  username:"postgres",
  password:"matuzay32",
  database:"taks-management",
  autoLoadEntities:true,
  synchronize:true


  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
