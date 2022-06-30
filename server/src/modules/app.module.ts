import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config.module';
import { CharModule } from './char.module';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AppGateway } from 'src/gateways/app.gateway';

@Module({
  imports: [
    ConfigurationModule,
    CharModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
