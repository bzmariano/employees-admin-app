import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { RequestService } from "src/helpers/request.service"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly requestService: RequestService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()

    if (
      process.env.AUTH_TOKEN === null 
      || process.env.AUTH_TOKEN === undefined 
      || req.headers.authorization !== process.env.AUTH_TOKEN 
      ) {
      return false
    } else return true
  }
}
