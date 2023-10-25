import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common"
import { UserService } from "./user.service"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getMany() {
    return { data: await this.userService.getMany() }
  }

  @Get(":id")
  async getOne(@Param("id", ParseIntPipe) id: number) {
    return { data: await this.userService.getOne(id) }
  }
}
