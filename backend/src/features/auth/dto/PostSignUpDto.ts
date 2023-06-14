import {
  IsNotEmpty, IsString, MinLength, MaxLength, IsUUID, IsEmail
} from 'class-validator'

export class PostSignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
    password: string

  @IsNotEmpty()
  @IsString()
    userName: string

  @IsNotEmpty()
  @IsString()
  @IsUUID()
    tribeTypeId: string
}
