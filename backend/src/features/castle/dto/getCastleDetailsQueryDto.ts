import { IsNotEmpty } from 'class-validator';

export class getCastleDetailsQueryDto {
  @IsNotEmpty()
  castleId: string
}
