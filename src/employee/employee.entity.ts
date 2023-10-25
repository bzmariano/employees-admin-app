import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity, OneToMany } from "typeorm"
import { MaritalStatus } from "./employee.enum"

@Entity("employees")
export class Employee extends GenericEntity {
  @Column({ type: "varchar", length: 20 })
  number!: number

  @Column({ type: "varchar", length: 20 })
  userId!: number

  @Column({ type: "varchar", length: 50 })
  name!: string

  @Column({ type: "varchar", length: 50 })
  surname!: string

  @Column({ type: "varchar", length: 20, unique: true })
  dni!: string

  @Column({ type: "varchar", length: 20, unique: true })
  cuil!: string

  @Column({ type: "enum", enum: MaritalStatus })
  marital_status!: MaritalStatus
}
