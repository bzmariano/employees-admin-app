import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { BadRequestException, ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  if (process.env.ENV === "prod")
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        disableErrorMessages: true,
        exceptionFactory: (e) => {
          console.error(e)
          throw new BadRequestException("request-data validation error")
        },
      })
    )
  else
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false,
      })
    )

  const config = new DocumentBuilder()
    .setTitle("RRHH")
    .setDescription("REST API")
    .setVersion("1.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)

  app.use(helmet())
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
