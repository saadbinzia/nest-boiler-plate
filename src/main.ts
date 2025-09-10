import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidateInputPipe } from "./core/pipes/validate.pipe";
import { GlobalExceptionFilter } from "./core/filters/global-exception.filter";
import { json, urlencoded } from "express";
import * as express from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
/**
 *  Main function from where the app starts
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.useStaticAssets(join(__dirname, "..", "public"));

  app.use(
    "/Webhooks/stripe",
    express.raw({
      type: "application/json",
      verify: (req, res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle("Semper Stream")
    .setDescription(
      "This is the documentation of all the APis used in the Semper Stream",
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

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(new ValidateInputPipe());

  app.use(json({ limit: "2gb" }));
  app.use(urlencoded({ limit: "2gb", extended: true }));

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
