import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity } from "typeorm"

@Entity("branches")
export class Branch extends GenericEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string

  @Column({ type: "varchar", length: 50 })
  state!: string
}
