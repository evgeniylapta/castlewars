import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator'

export class PostCreateUnitOrderDto {
  @IsUUID(4)
  @IsNotEmpty()
    unitTypeId: string

  @IsUUID(4)
  @IsNotEmpty()
    castleId: string

  @IsNotEmpty()
  @IsNumber()
    amount: number
}
