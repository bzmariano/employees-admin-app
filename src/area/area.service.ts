import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Area } from "./area.entity"
import { Repository } from "typeorm"
import { CreateAreaDTO, UpdateAreaDTO } from "./area.dto"
import { formatSqlResponse } from "src/helpers/formatSqlResponse"

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>
  ) {}

  //

  async getMany(all: boolean): Promise<Area[]> {
    try {
    if (all)
      return await this.areaRepository
        .createQueryBuilder("t")
        .withDeleted()
        .getMany()
    else return await this.areaRepository.find()
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message))
    }
  }

  //

  async getOne(id: number): Promise<Area> {
    try {
      return await this.areaRepository.findOneByOrFail({ id })
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message))
    }
  }

  //

  async createOne(body: CreateAreaDTO): Promise<Area | string> {
    const area = this.areaRepository.create(body)
    try {
      return await this.areaRepository.save(area)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async updateOne(id: number, body: UpdateAreaDTO): Promise<Area | string> {
    const data = await this.areaRepository.findOneBy({ id: id })
    if (!data) throw new NotFoundException()
    const updated = Object.assign(data, body)
    try {
      await this.areaRepository.save(updated)
      return await this.getOne(id)
    } catch (err) {
      if (err.message) throw new ConflictException(formatSqlResponse(err))
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.areaRepository.findOneBy({ id })
    if (!data) throw new NotFoundException()
    else return await this.areaRepository.softRemove(data)
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.areaRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne()
    if (!data) throw new NotFoundException()
    else return await this.areaRepository.recover(data)
  }
}
