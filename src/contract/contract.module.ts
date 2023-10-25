import { Module } from "@nestjs/common"
import { ContractService } from "./contract.service"
import { ContractController } from "./contract.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Contract } from "./contract.entity"
import { Department } from "src/department/department.entity"
import { Area } from "src/area/area.entity"
import { Company } from "src/company/company.entity"
import { Employee } from "src/employee/employee.entity"
import { Role } from "src/role/role.entity"
import { Branch } from "src/branch/branch.entity"
import { EmployeeService } from "src/employee/employee.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      Company,
      Branch,
      Department,
      Area,
      Role,
      Employee,
    ]),
  ],
  exports: [ContractService],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
