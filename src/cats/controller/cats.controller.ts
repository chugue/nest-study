import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from '../services/cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatRequestDto } from '../dto/cat.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatResponseDTO } from '../dto/cat.response.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentCat } from 'src/common/decorators/cats.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { Cat } from '../cats.schema';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentCat() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: CatResponseDTO,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async singUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiOperation({ summary: '이미지 업로드' })
  @UseInterceptors(FileInterceptor('image', multerOptions('cats')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(
    @UploadedFile() files: Express.Multer.File,
    @CurrentCat() cat: Cat,
  ) {
    return this.catsService.uploadImg(cat, files);
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}
