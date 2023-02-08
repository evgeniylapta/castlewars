import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { TAttackCreationData } from '../types';

export class PostCreateAttackBodyDto {
  @IsNotEmpty()
  @IsString()
  castleId: string

  @IsNotEmpty()
  @IsObject()
  data: TAttackCreationData
}
