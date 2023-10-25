import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity } from "typeorm"

@Entity("departments")
export class Department extends GenericEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string
}
