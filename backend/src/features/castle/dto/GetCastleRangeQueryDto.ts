import { IsNotEmpty } from 'class-validator'

export class GetCastleRangeQueryDto {
  @IsNotEmpty()
    minX: string

  @IsNotEmpty()
    minY: string

  @IsNotEmpty()
    maxX: string

  @IsNotEmpty()
    maxY: string
}
