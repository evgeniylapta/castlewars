import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetUnitsOrdersDto {
  @IsUUID(4)
  @IsNotEmpty()
    castleId: string
}
