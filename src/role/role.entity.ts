import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity } from "typeorm"

@Entity("roles")
export class Role extends GenericEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string
}
