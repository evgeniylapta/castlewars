import { IsNotEmpty, IsString } from 'class-validator'

export class GetAttackHistoryQueryDto {
  @IsNotEmpty()
    castleId: string

  @IsNotEmpty()
  @IsString()
    offset: string

  @IsNotEmpty()
  @IsString()
    limit: string
}
