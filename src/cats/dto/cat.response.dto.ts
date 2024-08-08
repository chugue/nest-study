import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../cats.schema';

export class CatResponseDTO extends PickType(Cat, ['email', 'name'] as const) {
  @ApiProperty({
    example: '123093',
    description: 'id',
  })
  id: string;
}
