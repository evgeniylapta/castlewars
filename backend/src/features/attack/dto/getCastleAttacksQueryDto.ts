import { IsNotEmpty } from 'class-validator';

export class getCastleAttacksQueryDto {
  @IsNotEmpty()
  castleId: string
}
