import { Injectable } from '@nestjs/common';

@Injectable()
export class CharService {
  getChar(): string {
    return 'CATCATCAT!';
  }
}
