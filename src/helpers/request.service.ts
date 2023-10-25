import { Injectable, Scope } from "@nestjs/common"
import * as dotenv from "dotenv"

dotenv.config()

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private userId: string = null

  setUserId(userId: string) {
    this.userId = userId
  }
  getUserId() {
    return this.userId
  }
}
