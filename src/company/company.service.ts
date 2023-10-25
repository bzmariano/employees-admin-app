import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Company } from "./company.entity"
import { Repository } from "typeorm"
import { CreateCompanyDTO, UpdateCompanyDTO } from "./company.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  //

  async getMany(all: boolean): Promise<Company[]> {
    try {
      if (all)
        return await this.companyRepository
          .createQueryBuilder("t")
          .withDeleted()
          .getMany()
      else return await this.companyRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Company> {
    try {
      return await this.companyRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateCompanyDTO): Promise<Company | string> {
    const company = this.companyRepository.create(body)
    try {
      return await this.companyRepository.save(company)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async updateOne(
    id: number,
    body: UpdateCompanyDTO
  ): Promise<Company | string> {
    const data = await this.companyRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.companyRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.companyRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.companyRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.companyRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.companyRepository.recover(data)
  }
}
