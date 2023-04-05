import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class PostSignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string;
}
