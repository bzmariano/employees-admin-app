import { MiddlewareConsumer, Module, NestModule, Scope } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CompanyModule } from "./company/company.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { dataSourceOptions } from "./data_source"
import { BranchModule } from "./branch/branch.module"
import { DepartmentModule } from "./department/department.module"
import { AreaModule } from "./area/area.module"
import { RoleModule } from "./role/role.module"
import { ContractModule } from "./contract/contract.module"
import { EmployeeModule } from "./employee/employee.module"
import { PaycheckModule } from "./paycheck/paycheck.module"
import { UserModule } from "./user/user.module"
import { RequestService } from "./helpers/request.service"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { AuthGuard } from "./guards/auth.guard"
import { LoggingInterceptor } from "./interceptors/logging.interceptor"
import { FreezePipe } from "./pipes/freeze.pipe"
import { HttpExceptionFilter } from "./filters/http_exception.filter"
import { UserCallInterceptor } from "./interceptors/user-call.interceptor"
import { AuthenticationMiddleware } from "./middlewares/authentication.middleware"

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    RequestService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: UserCallInterceptor,
    },
    { provide: APP_PIPE, useClass: FreezePipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    CompanyModule,
    BranchModule,
    DepartmentModule,
    AreaModule,
    RoleModule,
    ContractModule,
    EmployeeModule,
    PaycheckModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*")
  }
}
