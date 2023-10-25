import { PartialType } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class CreateBranchDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string
}

export class UpdateBranchDTO extends PartialType(CreateBranchDTO) {}
