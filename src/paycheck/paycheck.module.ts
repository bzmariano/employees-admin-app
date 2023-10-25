import { Module } from "@nestjs/common"
import { PaycheckService } from "./paycheck.service"
import { PaycheckController } from "./paycheck.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Paycheck } from "./paycheck.entity"
import { PdfService } from "src/helpers/pdf.service"
import { Employee } from "src/employee/employee.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Paycheck, Employee])],
  providers: [PaycheckService, PdfService],
  controllers: [PaycheckController],
})
export class PaycheckModule { }
