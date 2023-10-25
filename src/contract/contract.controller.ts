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
import { ContractService } from "./contract.service"
import { CreateContractDTO, UpdateContractDTO } from "./contract.dto"

@ApiTags("Contract Module")
@Controller("contract")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.contractService.getMany(flag) }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.contractService.getOne(id) }
  }

  @Get("/employee/:id")
  async getOneByEmployeeId(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.contractService.getOneByEmployeeId(id) }
  }

  @Post()
  async createOne(@Body() body: CreateContractDTO) {
    return { data: await this.contractService.createOne(body) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.contractService.restoreOne(id) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.contractService.deleteOne(id) }
  }
}
