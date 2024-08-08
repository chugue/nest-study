import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from '../dto/cat.request.dto';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../repository/cats.repository';
import { Cat } from '../cats.schema';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  // 모든 고양이 가져오기
  async getAllCat() {
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }

  // 이미지 업로드
  async uploadImg(cat: Cat, files: Express.Multer.File) {
    const fileName = `cats/${files.filename}`;
    console.log(fileName);

    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }

  // 회원 가입
  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existsByEmail(email);

    if (isCatExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }
}
