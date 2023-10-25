import { ValidateNested } from "class-validator"
import { Area } from "src/area/area.entity"
import { Branch } from "src/branch/branch.entity"
import { Company } from "src/company/company.entity"
import { Department } from "src/department/department.entity"
import { Employee } from "src/employee/employee.entity"
import { GenericEntity } from "src/generics/generic-entity"
import { Role } from "src/role/role.entity"
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { ContractType } from "./contract.enum"

@Entity("contracts")
export class Contract extends GenericEntity {
  @Column({
    type: "enum",
    enum: ContractType,
  })
  type!: ContractType

  @Column({ type: "timestamp" })
  start_date!: Date

  @ManyToOne(() => Company, { eager: true })
  @JoinColumn()
  company: Company

  @ManyToOne(() => Branch, { eager: true })
  @JoinColumn()
  branch: Branch

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn()
  department: Department

  @ManyToOne(() => Area, { eager: true })
  @JoinColumn()
  area: Area

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn()
  role: Role

  @ManyToOne(() => Employee, {
    eager: true,
  })
  @JoinColumn()
  employee!: Employee
}
