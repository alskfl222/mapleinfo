import { Controller, Get, Param, Res } from '@nestjs/common';
import { CharService } from '../services/char.service';
import * as expData from '../variables/exp.json';

@Controller('char')
export class CharController {
  constructor(private readonly charService: CharService) {}

  @Get(':char')
  async getChar(@Param() params, @Res() res): Promise<any> {
    const char = params.char;
    const result = await this.charService.getChar(char);
    if (typeof result === 'object') {
      if (result !== null) {
        const expPer = result.exp / expData[result.level - 1].exp;
        result.exp_per = expPer;
        return res.status(200).send(result);
      } else {
        return res.status(404).send('not found');
      }
    } else {
      return res.status(500).send('internal server error');
    }
  }
  @Get(':char/change')
  async getCharChange(@Param() params, @Res() res): Promise<any> {
    const char = params.char;
    const result = await this.charService.getCharChange(char);
    if (Array.isArray(result)) {
      if (result.length === 2) {
        const beforeLv = result[1].level;
        const beforeExp = Number(result[1].exp);
        const beforeExpPer = beforeExp / expData[beforeLv - 1].exp;
        const afterLv = result[0].level;
        const afterExp = Number(result[0].exp);
        const afterExpPer = afterExp / expData[afterLv - 1].exp;
        const data = {
          date: result[0].date,
          exp_change: (expData[afterLv - 1].acc_exp + afterExp) - (expData[beforeLv - 1].acc_exp + beforeExp),
          exp_per_change: afterLv + afterExpPer - (beforeLv + beforeExpPer),
        };
        return res.status(200).send(data);
      } else {
        return res.status(404).send('not found or not enough data');
      }
    } else {
      return res.status(500).send('internal server error');
    }
  }
}
