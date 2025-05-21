import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidateInputPipe } from "./core/pipes/validate.pipe";

/**
 *  Main function from where the app starts
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Ahora Point Back End")
    .setDescription(
      "This is the documentation of all the APis used in the ProjectNameHere system",
    )
    .setVersion("1.0")
    .addTag(process.env["NODE_ENV"].toUpperCase())
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "access-token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  // Global validation pipe
  app.useGlobalPipes(new ValidateInputPipe());

  // CORS configuration
  app.enableCors({
    allowedHeaders: "*",
    origin: (origin, callback) => {
      const allowedOrigins = process.env["CORS"]
        .split(",")
        .map((origin) => origin.trim());
      if (allowedOrigins.includes("*")) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      const isAllowed: any = allowedOrigins.find(
        (allowedOrigin) => origin === allowedOrigin,
      );

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  });
  await app.listen(process.env["PORT"]);
}
bootstrap();
