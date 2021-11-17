import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
const isProduction = true;
//comment
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TasksModule,
  /*   TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'matuzay32',
      database: 'taks-management',
      autoLoadEntities: true,
      synchronize: true,
    }), */

    
    TypeOrmModule.forRoot({
      
      type: 'postgres',
      host: 'ec2-52-208-229-228.eu-west-1.compute.amazonaws.com',
      port: 5432,
      username: 'oxbvsrnbequngq',
      password: '6eb6682dcef1b198005f9b798656b51c794d0a8fc6dedc7c92246edf4bd55333',
      database: 'dgmhik9k8b7bb',
      ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
