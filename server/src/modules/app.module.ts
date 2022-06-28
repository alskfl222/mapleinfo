import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './config.module';
import { CharModule } from './char.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

const DBID = process.env.MONGODB_ID;
const DBPW = process.env.MONGODB_PW;

const ConnectUri = `mongodb+srv://${DBID}:${DBPW}@info.syvdo.mongodb.net/info?retryWrites=true&w=majority`;

console.log(DBID, DBPW);

@Module({
  imports: [
    ConfigurationModule,
    CharModule,
    MongooseModule.forRoot(ConnectUri),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
