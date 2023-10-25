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
import { EmployeeService } from "./employee.service"
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "./employee.dto"

@ApiTags("Employee Module")
@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.employeeService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.employeeService.getOne(id) }
  }

  @Post()
  async createOne(@Body() body: CreateEmployeeDTO) {
    return {
      data: await this.employeeService.createOne(body),
    }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.employeeService.restoreOne(id) }
  }

  @Put(":id")
  async updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateEmployeeDTO
  ) {
    return { data: await this.employeeService.updateOne(id, body) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.employeeService.deleteOne(id) }
  }
}
