import { IsNotEmpty } from 'class-validator';

export class GetCastleAttacksQueryDto {
  @IsNotEmpty()
  castleId: string
}
