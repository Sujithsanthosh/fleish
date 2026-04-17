import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*', // Allow all origins in development
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });

  // Setup WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Backend running on: http://localhost:${port}`);
  console.log(`📡 WebSocket server: ws://localhost:${port}`);
  console.log(`🌐 CORS enabled for development`);
}
bootstrap();
