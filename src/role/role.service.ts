import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Role } from "./role.entity"
import { Repository } from "typeorm"
import { CreateRoleDTO, UpdateRoleDTO } from "./role.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  //

  async getMany(all: boolean): Promise<Role[]> {
    try {
      if (all)
        return await this.roleRepository
          .createQueryBuilder("t")
          .withDeleted()
          .getMany()
      else return await this.roleRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateRoleDTO): Promise<Role | string> {
    const role = this.roleRepository.create(body)
    try {
      return await this.roleRepository.save(role)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async updateOne(id: number, body: UpdateRoleDTO): Promise<Role | string> {
    const data = await this.roleRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.roleRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.roleRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.roleRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.roleRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.roleRepository.recover(data)
  }
}
