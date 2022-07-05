import { Controller, Get, Param, Res } from '@nestjs/common';
import { CharService } from '../services/char.service';

@Controller('char')
export class CharController {
  constructor(private readonly charService: CharService) {}

  @Get(':char')
  async getChar(@Param() params, @Res() res): Promise<any> {
    const char = params.char;
    const result = await this.charService.getChar(char);
    if (typeof result === 'object') {
      if (result !== null) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send('not found')
      }
    } else {
      return res.status(500).send('internal server error');
    }
  }
}
