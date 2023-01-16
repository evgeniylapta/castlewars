import { IsNotEmpty } from 'class-validator';

export class GetDistanceBetweenCastlesQueryDto {
  @IsNotEmpty()
  fromCastleId: string

  @IsNotEmpty()
  toCastleId: string
}
