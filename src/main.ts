import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

let cachedApp: NestExpressApplication | null = null;

async function getApp() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('City Fix API')
      .setDescription('API documentation for City Fix application')
      .setVersion('1.0')
      .addTag('city-fix')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  if (req.url?.startsWith('/api/docs') || req.url?.startsWith('/docs-json')) {
    const app = await getApp();
    await app.init();

    // Handle the request
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp(req, res);
  } else {
    // For other routes, you might want to handle them differently
    const app = await getApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp(req, res);
  }
}

// Keep the standalone server for local development
if (require.main === module) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('City Fix API')
      .setDescription('API documentation for City Fix application')
      .setVersion('1.0')
      .addTag('city-fix')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
}
