import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator'

export class CastleCreateDto {
  @IsUUID(4)
  @IsNotEmpty()
    userId: string

  @IsNotEmpty()
  @IsNumber()
    x: number

  @IsNotEmpty()
  @IsNumber()
    y: number
}
