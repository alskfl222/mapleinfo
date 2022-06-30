import { Module } from '@nestjs/common';
import { CharController } from '../controllers/char.controller';
import { CharService } from '../services/char.service';

@Module({
  controllers: [CharController],
  providers: [CharService],
})
export class CharModule {}
