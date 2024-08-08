import { JwtService } from '@nestjs/jwt';
import { CatsRepository } from '../cats/repository/cats.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './\bdto/login.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    // email 중복 체크
    const cat = await this.catsRepository.findCatByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('중복되는 이메일이 존재합니다.');
    }

    // password 일치 여부 체크
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email: email, id: cat.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
