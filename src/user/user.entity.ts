import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("users")
export class User {
  @PrimaryColumn("uuid", { length: 255, unique: true })
  employeeId!: number

  @Column({ type: "varchar", length: 50 })
  controller!: string

  @Column({ type: "varchar", length: 50 })
  url!: string

  @Column({ type: "varchar", length: 50 })
  handler!: string

  @UpdateDateColumn({ type: "timestamp" })
  last_call!: Date

  @CreateDateColumn({ type: "timestamp" })
  creationDate: Date
}
