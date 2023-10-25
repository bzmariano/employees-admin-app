import { PartialType } from "@nestjs/swagger"
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator"
import { enumToString } from "src/helpers/enum-to-string"
import { PaycheckType } from "./paycheck.enum"

export class CreatePaycheckDTO {
  @IsEnum(PaycheckType, {
    message: `Invalid option. Correct options are: ${enumToString(
     PaycheckType
    )}`,
  })
  type: PaycheckType

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  description: string
}

export class UpdatePaycheckDTO extends PartialType(CreatePaycheckDTO) {}
