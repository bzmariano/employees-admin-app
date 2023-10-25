import {
    BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "./contract.entity";
import { Repository } from "typeorm";
import { CreateContractDTO } from "./contract.dto";
import { Company } from "src/company/company.entity";
import { Branch } from "src/branch/branch.entity";
import { Department } from "src/department/department.entity";
import { Role } from "src/role/role.entity";
import { Area } from "src/area/area.entity";
import { formatSqlResponse } from "src/helpers/formatSqlResponse";
import { Employee } from "src/employee/employee.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  //

  async getMany(all: boolean): Promise<Contract[]> {
    try {
      if (all)
        return await this.contractRepository
          .createQueryBuilder("t")
          .withDeleted()
          .leftJoinAndSelect("t.employee", "employees")
          .leftJoinAndSelect("t.company", "companies")
          .leftJoinAndSelect("t.branch", "branches")
          .leftJoinAndSelect("t.department", "departments")
          .leftJoinAndSelect("t.area", "areas")
          .leftJoinAndSelect("t.role", "roles")
          .getMany();
      else return await this.contractRepository.find();
    } catch (err) {
      throw new InternalServerErrorException(formatSqlResponse(err.message));
    }
  }

  //

  async getOne(id: number): Promise<Contract> {
    try {
      return await this.contractRepository.findOneByOrFail({ id });
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async getOneByEmployeeId(id: number): Promise<Contract> {
    try {
      return await this.contractRepository
        .createQueryBuilder("t")
        .innerJoinAndSelect("t.company", "companies")
        .innerJoinAndSelect("t.branch", "branch")
        .innerJoinAndSelect("t.area", "area")
        .innerJoinAndSelect("t.department", "department")
        .innerJoinAndSelect("t.role", "role")
        .innerJoinAndSelect("t.employee", "employees", "employees.id = :id", {
          id: id,
        })
        .getOne();
    } catch (err) {
      throw new NotFoundException(formatSqlResponse(err.message));
    }
  }

  //

  async createOne(body: CreateContractDTO): Promise<Contract | string> {
    try {
      let contract = await this.contractRepository
        .createQueryBuilder("t")
        .where("t.employeeId = :id", { id: body.employee })
        .getOne();
      if (!contract) {
        contract = new Contract();
        contract.start_date = body.start_date;
        contract.type = body.type;
        contract.employee = await this.employeeRepository.findOneOrFail({
          where: { id: body.employee },
        });
        contract.company = await this.companyRepository.findOneOrFail({
          where: { id: body.company },
        });
        contract.branch = await this.branchRepository.findOneOrFail({
          where: { id: body.branch },
        });
        contract.department = await this.departmentRepository.findOneOrFail({
          where: { id: body.department },
        });
        contract.area = await this.areaRepository.findOneOrFail({
          where: { id: body.area },
        });
        contract.role = await this.roleRepository.findOneOrFail({
          where: { id: body.role },
        });
        const data = this.contractRepository.create(contract);
        return await this.contractRepository.save(data);
      } else
        throw new ConflictException(
          `Employee with id: ${body.employee} already has an active contract with contractId: ${contract.id}`
        );
    } catch (err) {
      throw new BadRequestException(formatSqlResponse(err.message));
    }
  }

  //

  async deleteOne(id: number): Promise<Object> {
    const data = await this.contractRepository.findOneBy({ id });
    if (!data) throw new NotFoundException();
    else return await this.contractRepository.softRemove(data);
  }

  //

  async restoreOne(id: number): Promise<Object> {
    const data = await this.contractRepository
      .createQueryBuilder("t")
      .withDeleted()
      .where("t.id = :id", { id: id })
      .getOne();
    if (!data) {
      throw new NotFoundException();
    }
    const activeContractForSameEmployee =
      await this.contractRepository.findOneBy({ id });
    if (activeContractForSameEmployee) {
      throw new ConflictException(
        "Already exist a active contract for the same employee"
      );
    }
    return this.contractRepository.recover(data);
  }
}
