import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Employee } from "./employee.entity"
import { Repository } from "typeorm"
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "./employee.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  //

  async getMany(all: boolean): Promise<Employee[]> {
    try {
      if (all)
        return await this.employeeRepository
          .createQueryBuilder("t")
          .withDeleted()
          .getMany()
      else return await this.employeeRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Employee | string> {
    try {
      return await this.employeeRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateEmployeeDTO): Promise<Employee | string> {
    try {
      const employee = this.employeeRepository.create(body)
      return await this.employeeRepository.save(employee)
    } catch (err) {
      if (err.message) console.log(err)
      throw new ConflictException(formatSqlResponse(err.message))
    }
  }

  //

  async updateOne(
    id: number,
    body: UpdateEmployeeDTO
  ): Promise<Employee | string> {
    const data = await this.employeeRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.employeeRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message)
        throw new ConflictException(formatSqlResponse(err.message))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.employeeRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.employeeRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.employeeRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.employeeRepository.recover(data)
  }
}
