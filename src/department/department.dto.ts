import { PartialType } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class CreateDepartmentDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string
}

export class UpdateDepartmentDTO extends PartialType(CreateDepartmentDTO) {}
