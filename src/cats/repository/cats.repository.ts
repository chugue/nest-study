import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from '../cats.schema';
import { CatRequestDto } from '../dto/cat.request.dto';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  // 모든 고양이를 조회하는 로직
  async findAll() {
    return await this.catModel.find();
  }

  // Id로 고양이를 찾아서 img를 업데이트 하는 로직
  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);

    cat.imgUrl = `http://localhost:8000/media/${fileName}`;

    const newCat = await cat.save();

    console.log(newCat);
    return newCat.readOnlyData;
  }

  // Id로 고양이 찾으면서 비번은 제외하고 가져오기
  async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
    const cat = await this.catModel.findById(catId).select('-password');
    return cat;
  }

  // 이메일로 Cat정보 가져오기
  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  // 이메일 존재여부 체크
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email });
    return result !== null;
  }

  // DB에 새 객체 생성
  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}
