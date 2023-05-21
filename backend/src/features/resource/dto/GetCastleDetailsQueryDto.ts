import { IsNotEmpty } from 'class-validator'

export class GetResourcesQueryDto {
  @IsNotEmpty()
    castleId: string
}
