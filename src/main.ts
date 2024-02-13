import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

/**
 *  Main function from where the app starts
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateInputPipe);
  app.enableCors({
    allowedHeaders: "*",
    origin: (origin, callback) => {
      const allowedOrigins = process.env['CORS'].split(',');

      const allowedSubdomains = process.env['SUBDOMAIN_CORS'].split(',');
      if (!origin) {
        return callback(null, true);
      }

      let isAllowed:any = allowedOrigins.find(allowedOrigin => origin === allowedOrigin);
      
      if(isAllowed){
        callback(null, true);
        return ;
      }

      const requestDomain = new URL(origin).host;

      // TODO: We might need to handle the case for http and https for subdomains
      isAllowed = allowedSubdomains.some(allowedOrigin =>
        requestDomain.endsWith(allowedOrigin.split('://')[1])
      );

      if(isAllowed){
        callback(null, true);
      }
      else{
        callback(new Error('Not allowed by CORS'));
      }
    }
  });
  await app.listen(process.env['PORT']);
}
bootstrap();
