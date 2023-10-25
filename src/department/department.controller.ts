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
import { DepartmentService } from "./department.service"
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "./department.dto"

@ApiTags("Department Module")
@Controller("department")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.departmentService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.departmentService.getOne(id) }
  }

  @Post()
  async createOne(@Body() body: CreateDepartmentDTO) {
    return { data: await this.departmentService.createOne(body) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.departmentService.restoreOne(id) }
  }

  @Put(":id")
  async updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateDepartmentDTO
  ) {
    return { data: await this.departmentService.updateOne(id, body) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.departmentService.deleteOne(id) }
  }
}
