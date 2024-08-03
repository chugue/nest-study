import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // 여기서 비즈니스 로직이 실행이 됨.
    return 'Hello World!';
  }
}
