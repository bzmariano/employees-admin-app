import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AreaService } from "./area.service"
import { CreateAreaDTO, UpdateAreaDTO } from "./area.dto"

@ApiTags("Area Module")
@Controller("area")
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.areaService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.areaService.getOne(id) }
  }

  @Post()
  async createOne(@Body() body: CreateAreaDTO) {
    return { data: await this.areaService.createOne(body) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.areaService.restoreOne(id) }
  }

  @Put(":id")
  async updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateAreaDTO
  ) {
    return { data: await this.areaService.updateOne(id, body) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.areaService.deleteOne(id) }
  }
}
