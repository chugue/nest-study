import { InjectModel } from '@nestjs/mongoose';
import { CommentsCreateDTO } from '../dto/req/comments.create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Comments } from '../comments.schema';
import { CatsRepository } from 'src/cats/repository/cats.repository';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly catsRepository: CatsRepository,
  ) {}

  // 좋아요 추가
  addLike(id: string) {}

  // 고양이 댓글 생성
  async createComments(id: string, reqDTO: CommentsCreateDTO) {
    try {
      // 게시물의 작성자 고양이를 찾기
      const targetCat =
        await this.catsRepository.findCatByIdWithoutPassword(id);

      // CommentsCreateDTO를 구조분해 할당
      const { contents, author } = reqDTO;

      const validatedAuthor =
        await this.catsRepository.findCatByIdWithoutPassword(author);

      const newComment = new this.commentsModel({
        author: validatedAuthor._id,
        contents,
        info: targetCat._id,
      });
      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 모든 댓글 불러오기
  getAllComments() {
    return 'Hello world';
  }
}
