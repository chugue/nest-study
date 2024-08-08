import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { ApiOperation } from '@nestjs/swagger';
import { CommentsCreateDTO } from '../dto/req/comments.create.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '모든 고양이 프로필 댓글 가져오기' })
  @Get()
  async getAllComments() {
    return this.commentsService.getAllComments();
  }

  @ApiOperation({ summary: '특정 고양이 프로필에 댓글 달기' })
  @Post(':id')
  async createComments(
    @Param('id') id: string,
    @Body() body: CommentsCreateDTO,
  ) {
    return this.commentsService.createComments(id, body);
  }

  @ApiOperation({ summary: '좋아요 수 올리기' })
  @Post(':id')
  async addLike(@Param('id') id: string) {
    return this.commentsService.addLike(id);
  }
}
