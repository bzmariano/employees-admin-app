import { GenericEntity } from "src/generics/generic-entity"
import { Column, Entity } from "typeorm"

@Entity("areas")
export class Area extends GenericEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string
}
