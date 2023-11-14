import { IsNotEmpty } from 'class-validator'

export class GetCastleDetailsQueryDto {
  @IsNotEmpty()
    castleId: string
}
