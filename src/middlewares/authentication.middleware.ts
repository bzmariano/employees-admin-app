import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from "@nestjs/common"
import { RequestService } from "src/helpers/request.service"
import { UserService } from "src/user/user.service"

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly requestService: RequestService) {}
  private readonly logger = new Logger(AuthenticationMiddleware.name)

  async use(req: any, res: any, next: (error?: any) => void) {
    const userId = req.headers.userid
    if (userId) this.requestService.setUserId(userId)
    next()
  }
}
