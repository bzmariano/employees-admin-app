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
import { RoleService } from "./role.service"
import { CreateRoleDTO, UpdateRoleDTO } from "./role.dto"

@ApiTags("Role Module")
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.roleService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.roleService.getOne(id) }
  }

  @Post()
  async createOne(@Body() body: CreateRoleDTO) {
    return { data: await this.roleService.createOne(body) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.roleService.restoreOne(id) }
  }

  @Put(":id")
  async updateOne(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateRoleDTO
  ) {
    return { data: await this.roleService.updateOne(id, body) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.roleService.deleteOne(id) }
  }
}
