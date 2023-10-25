import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common"
import { Observable, tap } from "rxjs"
import { RequestService } from "src/helpers/request.service"
import { UserService } from "src/user/user.service"

@Injectable()
export class UserCallInterceptor implements NestInterceptor {
  constructor(
    private readonly requestService: RequestService,
    private readonly userService: UserService
  ) {}
  private readonly logger = new Logger(UserCallInterceptor.name)

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const controller = context.getClass().name
    const { path: url } = req
    const handler = context.getHandler().name

    this.logger.log(UserCallInterceptor.name)

    const userId = this.requestService.getUserId()

    if (userId)
      await this.userService.updateOne(
        parseInt(userId),
        controller,
        url,
        handler
      )

    return next.handle()
  }
}
