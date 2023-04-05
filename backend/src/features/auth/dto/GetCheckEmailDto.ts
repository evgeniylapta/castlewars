import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetCheckEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string
}
