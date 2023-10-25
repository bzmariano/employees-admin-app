import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { Employee } from "src/employee/employee.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
