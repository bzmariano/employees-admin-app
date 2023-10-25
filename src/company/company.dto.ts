import { PartialType } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) {}
