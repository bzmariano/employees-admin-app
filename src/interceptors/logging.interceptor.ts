import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common"
import { Observable, tap } from "rxjs"
import { RequestService } from "src/helpers/request.service"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly requestService: RequestService) {}
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const userAgent = req.get("user-agent")
    const { ip, method, path: url } = req

    this.logger.log(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } Invoked...
    `
    )
    this.logger.debug("ùserId: " + this.requestService.getUserId())

    const now = Date.now()
    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse()
        const { statusCode } = response
        const contentLength = response.get("content-length")
        this.logger.log(
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
            Date.now() - now
          }ms`
        )
        this.logger.debug("Response:", res)
      })
    )
  }
}
