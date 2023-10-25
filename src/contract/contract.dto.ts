import { PartialType } from "@nestjs/swagger"
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsPositive,
} from "class-validator"
import { CreateEmployeeDTO } from "src/employee/employee.dto"
import { enumToString } from "src/helpers/enum-to-string"
import { ContractType } from "./contract.enum"

export class CreateContractDTO {
  @IsEnum(ContractType, {
    message: `Invalid option. Correct options are: ${enumToString(
      ContractType
    )}`,
  })
  type: ContractType

  @IsDateString()
  @IsNotEmpty()
  start_date: Date

  @IsNumber()
  @IsPositive()
  company: number

  @IsNumber()
  @IsPositive()
  branch: number

  @IsNumber()
  @IsPositive()
  department: number

  @IsNumber()
  @IsPositive()
  area: number

  @IsNumber()
  @IsPositive()
  role: number

  @IsNumber()
  @IsPositive()
  employee: number
}

export class UpdateContractDTO extends PartialType(CreateContractDTO) {}
