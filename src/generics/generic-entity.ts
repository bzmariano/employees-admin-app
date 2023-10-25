import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm"

export class GenericEntity {
  @PrimaryGeneratedColumn()
  id: number

  @DeleteDateColumn()
  deleteDate: Date

  @CreateDateColumn({ type: "timestamp" })
  timestamp: Date
}
