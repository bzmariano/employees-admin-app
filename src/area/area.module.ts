import { Module } from "@nestjs/common"
import { AreaService } from "./area.service"
import { AreaController } from "./area.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Area } from "./area.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Area])],
  providers: [AreaService],
  controllers: [AreaController],
})
export class AreaModule {}
