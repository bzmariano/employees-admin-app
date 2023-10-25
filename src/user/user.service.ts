import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Employee } from "src/employee/employee.entity"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"
import { Repository } from "typeorm"
import { User } from "./user.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  async getMany(): Promise<User[]> {
    try {
      return await this.userRepository.find()
    } catch(err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { employeeId: id },
      })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  async updateOne(
    id: number,
    controller: string,
    url: string,
    handler: string
  ): Promise<User> {
    try {
      const employee = await this.employeeRepository.findOneBy({ id })

      if (employee) {
        let user = await this.userRepository.findOne({
          where: { employeeId: id },
        })

        if (!user) {
          user = new User()
          user.employeeId = employee.id
          this.userRepository.create(user)
        }

        user.controller = controller
        user.url = url
        user.handler = handler

        return await this.userRepository.save(user)
      }
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }
}
