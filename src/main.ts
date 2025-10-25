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

    // Custom setup for better Vercel compatibility
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'City Fix API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        deepLinking: false,
      },
      customfavIcon: '/api/docs/favicon.ico',
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.js',
      ],
    });

    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  await app.init();

  // Handle the request
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
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

    // Custom setup for better Vercel compatibility
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'City Fix API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        deepLinking: false,
      },
      customfavIcon: '/api/docs/favicon.ico',
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.js',
      ],
    });

    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
}
