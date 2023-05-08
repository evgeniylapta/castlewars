import { Type } from 'class-transformer'
import {
  IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber
} from 'class-validator'

class Item {
  @IsUUID(4)
  @IsNotEmpty()
    unitTypeId: string

  @IsNumber()
    amount: number
}

export class PostCreateUnitsOrderDto {
  @IsUUID(4)
  @IsNotEmpty()
    castleId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
    items: Item[]
}
