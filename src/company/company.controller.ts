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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './company.dto';

@ApiTags('Company Module')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getMany(@Query('all') all: string) {
    let flag = false;
    if (!!all) flag = all.toLowerCase() === 'true';
    return { data: await this.companyService.getMany(flag) };
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return { data: await this.companyService.getOne(id) };
  }

  @Post()
  async createOne(@Body() body: CreateCompanyDTO) {
    return { data: await this.companyService.createOne(body) };
  }

  @Put('restore/:id')
  async restoreOne(@Param('id', ParseIntPipe) id: number) {
    return { data: await this.companyService.restoreOne(id) };
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCompanyDTO,
  ) {
    return { data: await this.companyService.updateOne(id, body) };
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return { data: await this.companyService.deleteOne(id) };
  }
}
