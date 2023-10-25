import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paycheck } from "./paycheck.entity";
import { Repository } from "typeorm";
import { formatSqlResponse } from "src/helpers/formatSqlResponse";
import { CreatePaycheckDTO } from "./paycheck.dto";
import { PdfService } from "src/helpers/pdf.service";
import { Employee } from "src/employee/employee.entity";
import * as fs from "fs";

@Injectable()
export class PaycheckService {
  constructor(
    @InjectRepository(Paycheck)
    private readonly paycheckRepository: Repository<Paycheck>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly pdfService: PdfService
  ) {}

  //

  async getMany(all: boolean): Promise<Paycheck[]> {
    try {
      if (all)
        return await this.paycheckRepository
          .createQueryBuilder("t")
          .withDeleted()
          .leftJoinAndSelect("t.employee", "employees")
          .getMany();
      else return await this.paycheckRepository.find();
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message));
    }
  }

  //

  async getOne(id: number): Promise<Paycheck> {
    try {
      const paycheck_row = await this.paycheckRepository.findOneByOrFail({
        id,
      });
      if (!fs.existsSync(paycheck_row.path)) throw new NotFoundException();
      return paycheck_row;
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  async getManyByEmployeeId(id: number): Promise<Paycheck[]> {
    try {
      await this.employeeRepository.findOneByOrFail({ id });
      const data = await this.paycheckRepository
        .createQueryBuilder("t")
        .where("t.employee.id = :id", { id: id })
        .getMany();
      return data;
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async getUploadedBatches(): Promise<Paycheck[]> {
    try {
      return await this.paycheckRepository
        .createQueryBuilder("t")
        .select("t.folder", "batch")
        .groupBy("batch")
        .distinct(true)
        .getRawMany();
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async createOne(
    body: CreatePaycheckDTO,
    file: Express.Multer.File
  ): Promise<string | Object> {
    try {
      const folder = file.destination;
      const recordToSave = [];
      let cuilNotFound = [];
      await this.pdfService.splitByPages(file);
      const paycheckFilenames = await this.pdfService.readFilenames(
        file.destination,
        file.filename
      );
      loop: for await (const p of paycheckFilenames) {
        const isSaved = await this.paycheckRepository.exist({
          where: { filename: p },
        });
        if (!isSaved) {
          const cuil = this.pdfService.getCuilfromFilename(p, 13);
          const employee = await this.employeeRepository.findOne({
            where: { cuil: cuil },
          });
          if (!employee) {
            cuilNotFound.push(cuil);
            continue loop;
          } else {
            const paycheck = new Paycheck();
            paycheck.filename = p;
            paycheck.folder = file.destination.split(".pdf")[0];
            paycheck.path = folder + "/" + p;
            paycheck.employee = employee;
            paycheck.description = body.description;
            paycheck.type = body.type;
            const data = this.paycheckRepository.create(paycheck);
            recordToSave.push(data);
          }
        }
      }
      cuilNotFound = [...new Set(cuilNotFound)];
      if (cuilNotFound.length === 0) {
        await this.paycheckRepository.save(recordToSave);
        return "Paychecks successfully uploaded";
      } else
        return {
          message: "Upload failed. This cuils were not found.",
          cuils: cuilNotFound,
        };
    } catch (err) {
      this.pdfService.deleteBatch(file.destination);
      throw new InternalServerErrorException(err.message);
    }
  }

  //

  async readPaycheck(id: number): Promise<Object> {
    try {
      const data = await this.paycheckRepository.findOneByOrFail({ id });
      data.read = true;
      return await this.paycheckRepository.save(data);
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async signPaycheck(id: number): Promise<Object> {
    try {
      const data = await this.paycheckRepository.findOneByOrFail({ id });
      data.signed = true;
      return await this.paycheckRepository.save(data);
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.paycheckRepository.findOneBy({ id });
    if (!data) throw new NotFoundException();
    else return await this.paycheckRepository.softRemove(data);
  }

  //

  async deleteByFolder(folder: string): Promise<Object> {
    try {
      const data = await this.paycheckRepository.findOneBy({ folder });
      if (!data) throw new NotFoundException();
      else {
        this.pdfService.deleteBatch(folder);
        const toDelete = await this.paycheckRepository.findBy({ folder });
        this.paycheckRepository.remove(toDelete);
        return await this.paycheckRepository.delete(data);
      }
    } catch (err) {
      return err;
    }
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.paycheckRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne();
    if (!data) throw new NotFoundException();
    else return await this.paycheckRepository.recover(data);
  }
}
