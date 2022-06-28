import { Controller, Get } from '@nestjs/common';
import { CharService } from '../services/char.service';

@Controller('char')
export class CharController {
  constructor(private readonly charService: CharService) {}

  @Get()
  getChar(): string {
    return this.charService.getChar();
  }
}
