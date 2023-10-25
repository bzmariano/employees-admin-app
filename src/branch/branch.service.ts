import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Branch } from "./branch.entity"
import { Repository } from "typeorm"
import { CreateBranchDTO, UpdateBranchDTO } from "./branch.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>
  ) {}

  //

  async getMany(all: boolean): Promise<Branch[]> {
    try {
      if (all)
        return await this.branchRepository
          .createQueryBuilder("t")
          .withDeleted()
          .getMany()
      else return await this.branchRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Branch> {
    try {
      return await this.branchRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateBranchDTO): Promise<Branch | string> {
    const branch = this.branchRepository.create(body)
    try {
      return await this.branchRepository.save(branch)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async updateOne(id: number, body: UpdateBranchDTO): Promise<Branch | string> {
    const data = await this.branchRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.branchRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.branchRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.branchRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.branchRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.branchRepository.recover(data)
  }
}
