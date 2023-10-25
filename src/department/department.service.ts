import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Department } from "./department.entity"
import { Repository } from "typeorm"
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "./department.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  //

  async getMany(all: boolean): Promise<Department[]> {
    try {
      if (all)
        return await this.departmentRepository
          .createQueryBuilder("t")
          .withDeleted()
          .getMany()
      else return await this.departmentRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Department> {
    try {
      return await this.departmentRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateDepartmentDTO): Promise<Department | string> {
    const department = this.departmentRepository.create(body)
    try {
      return await this.departmentRepository.save(department)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async updateOne(
    id: number,
    body: UpdateDepartmentDTO
  ): Promise<Department | string> {
    const data = await this.departmentRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.departmentRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message)
        throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.departmentRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.departmentRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.departmentRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.departmentRepository.recover(data)
  }
}
