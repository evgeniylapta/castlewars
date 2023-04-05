import { IsNotEmpty, IsString } from 'class-validator'

export class PostRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
    refreshToken: string
}
