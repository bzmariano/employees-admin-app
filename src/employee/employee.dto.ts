import { PartialType } from "@nestjs/swagger"
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator"
import { enumToString } from "src/helpers/enum-to-string"
import { MaritalStatus } from "./employee.enum"

export class CreateEmployeeDTO {
  @IsInt()
  @IsPositive()
  number: number

  @IsInt()
  @IsPositive()
  userId: number

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  surname: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  dni: string 

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  cuil: string 

  @IsEnum(MaritalStatus, {
    message: `Invalid option. Correct options are: ${enumToString(
      MaritalStatus
    )}`,
  })
  marital_status: MaritalStatus
}

export class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO) {}
