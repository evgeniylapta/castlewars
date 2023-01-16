import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class PostCreateAttackBodyDto {
  @IsNotEmpty()
  @IsString()
  castleId: string

  @IsNotEmpty()
  @IsObject()
  data: object
}
