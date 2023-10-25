import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { PaycheckService } from "./paycheck.service"
import { CreatePaycheckDTO } from "./paycheck.dto"
import { multerConfig } from "src/middlewares/multer.middleware"
import { createReadStream } from "fs"
import { join } from "path"

const paycheckFolder =
  process.env.PAYCHECK_FOLDER + `${new Date().toISOString().split("T").shift()}`

@ApiTags("Paycheck Module")
@Controller("paycheck")
export class PaycheckController {
  constructor(private readonly paycheckService: PaycheckService) { }

  @Get()
  async getMany(@Query("all") all: string) {
    let flag = false
    if (!!all) flag = all.toLowerCase() === "true"
    return { data: await this.paycheckService.getMany(flag) }
  }

  @Get("uploaded-batches")
  async getUploadedBatches() {
    return { data: await this.paycheckService.getUploadedBatches() }
  }

  @Get("/:id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.paycheckService.getOne(id) }
  }

  @Get("employee/:employeeId/all")
  async getManyByEmployeeId(@Param("employeeId", ParseIntPipe) employeeId: number) {
    return { data: await this.paycheckService.getManyByEmployeeId(employeeId) }
  }

  @Post("upload")
  @UseInterceptors(multerConfig(paycheckFolder, "application/pdf"))
  async uploadMany(
    @Body() body: CreatePaycheckDTO,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return {
      data: await this.paycheckService.createOne(body, file),
    }
  }

  @Get("download-pdf/:id")
  @Header("Content-Type", "application/pdf")
  async downloadOne(@Param("id", ParseIntPipe) id: number) {
    const file_row = await this.paycheckService.getOne(id)
    const file = createReadStream(join(process.cwd(), file_row.path))
    return new StreamableFile(file)
  }

  @Put("sign/:id")
  async signOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.paycheckService.signPaycheck(id) }
  }

  @Put("restore/:id")
  async restoreOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.paycheckService.restoreOne(id) }
  }

  @Delete(":id")
  async deleteOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.paycheckService.deleteOne(id) }
  }

  @Delete()
  async deleteByFolder(@Body("folder") folder: string) {
    return { data: await this.paycheckService.deleteByFolder(folder) }
  }
}
