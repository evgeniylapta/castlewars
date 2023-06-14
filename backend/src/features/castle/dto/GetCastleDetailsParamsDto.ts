import { IsNotEmpty } from 'class-validator'

export class GetCastleDetailsParamsDto {
  @IsNotEmpty()
    castleId: string
}
