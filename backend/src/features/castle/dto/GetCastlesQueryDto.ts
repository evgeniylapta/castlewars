import { IsNotEmpty } from 'class-validator';

export class GetCastlesQueryDto {
  @IsNotEmpty()
  minX: string

  @IsNotEmpty()
  minY: string

  @IsNotEmpty()
  maxX: string

  @IsNotEmpty()
  maxY: string
}
