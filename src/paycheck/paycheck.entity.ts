import { Employee } from "src/employee/employee.entity"
import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { PaycheckType } from "./paycheck.enum"

@Entity("paychecks")
export class Paycheck extends GenericEntity {
  @Column({ type: "varchar", unique: true })
  filename!: string

  @Column({ type: "enum", enum: PaycheckType })
  type!: PaycheckType

  @Column({ type: "varchar", length: 150, default: null })
  description: string
  
  @Column({ type: "varchar" })
  folder!: string

  @Column({ type: "varchar" })
  path!: string

  @Column({ type: "boolean", default: false })
  read: boolean

  @Column({ type: "boolean", default: false })
  signed: boolean

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn()
  employee!: Employee
}
