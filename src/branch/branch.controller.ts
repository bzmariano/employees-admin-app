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
import { BranchService } from "./branch.service"
import { CreateBranchDTO, UpdateBranchDTO } from "./branch.dto"

@ApiTags("Branch Module")
@Controller("branch")
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.branchService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.branchService.getOne(id) }
  }

  @Post()
  async createOne(@Body() body: CreateBranchDTO) {
    return { data: await this.branchService.createOne(body) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.branchService.restoreOne(id) }
  }

  @Put(":id")
  async updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateBranchDTO
  ) {
    return { data: await this.branchService.updateOne(id, body) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.branchService.deleteOne(id) }
  }
}
