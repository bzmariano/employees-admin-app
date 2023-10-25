import { PartialType } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class CreateAreaDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string
}

export class UpdateAreaDTO extends PartialType(CreateAreaDTO) {}
