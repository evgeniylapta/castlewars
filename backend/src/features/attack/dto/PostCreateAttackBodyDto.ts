import { IsNotEmpty, IsString, IsObject } from 'class-validator'
import { AttackCreationData } from '../types'

export class PostCreateAttackBodyDto {
  @IsNotEmpty()
  @IsString()
    castleId: string

  @IsNotEmpty()
  @IsObject()
    data: AttackCreationData
}
