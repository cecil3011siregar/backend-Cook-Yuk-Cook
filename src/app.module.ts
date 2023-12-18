import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';
import * as pino from 'pino';
// import { SeederModule } from '#/seeder/seeder.module';

import { LevelUsersModule } from './level-users/level-users.module';
import { AuthModule } from './auth/auth.module';
import { TrainingThemeController } from './training_theme/training_theme.controller';
import { TrainingThemeService } from './training_theme/training_theme.service';
import { TrainingThemeModule } from './training_theme/training_theme.module';
import { GaleryKitchenModule } from './galery_kitchen/galery_kitchen.module';
import { KitchenStudioModule } from './kitchen_studio/kitchen_studio.module';
import { RegularClassModule } from './regular-class/regular-class.module';
import { PrivateClassModule } from './private-class/private-class.module';
import { UsersModule } from './users/users.module';
import { BankController } from './bank/bank.controller';
import { BankModule } from './bank/bank.module';
import { CertificateController } from './certificate/certificate.controller';
import { CertificateModule } from './certificate/certificate.module';
import { KitchenStudioService } from './kitchen_studio/kitchen_studio.service';
import { KitchenStudioController } from './kitchen_studio/kitchen_studio.controller';
import { GalleryKitchenController } from './gallery-kitchen/gallery-kitchen.controller';
import { GalleryKitchenService } from './gallery-kitchen/gallery-kitchen.service';
import { GalleryKitchenModule } from './gallery-kitchen/gallery-kitchen.module';
import { UsersPaymentModule } from './users-payment/users-payment.module';
import { NotifikasiModule } from './notifikasi/notifikasi.module';
import { MaterialModule } from './material/material.module';
import { KitchenPaymentModule } from './kitchen-payment/kitchen-payment.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        base: undefined,
        genReqId: (req) => {
          return req['x-correlation-id'];
        },
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers["user-agent"]',
            'req.headers.accept',
            'req.headers["accept-encoding"]',
            'req.headers["accept-language"]',
            'req.headers.host',
            'req.headers.connection',
            'req.headers.cookie',
            'req.headers["sec-ch-ua"]',
            'req.headers["sec-ch-ua-mobile"]',
            'req.headers["sec-ch-ua-platform"]',
            'req.headers["upgrade-insecure-requests"]',
            'req.headers["sec-fetch-site"]',
            'req.headers["sec-fetch-mode"]',
            'req.headers["sec-fetch-user"]',
            'req.headers["sec-fetch-dest"]',
            'req.headers["if-none-match"]',
            'req.headers["cache-control"]',
            'req.query',
            'req.params',
            'req.remoteAddress',
            'req.remotePort',
            'res.headers["access-control-allow-origin"]',
            'res.headers["content-type"]',
            'res.headers["content-length"]',
            'res.headers["etag"]',
          ],
          remove: true,
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_CLIENT: Joi.valid('mysql', 'postgres'),
        DATABASE_HOST: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string().empty('').default(''),
        DATABASE_PORT: Joi.number().default(5432),
      }),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<'postgres' | 'mysql'>('database.client'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [],
          synchronize: configService.get<string>('env') === 'development',
          autoLoadEntities: true,
          logging: ["query", "error"],
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    // SeederModule,
    UsersModule,
    HealthModule,
    LevelUsersModule,
    AuthModule,
    TrainingThemeModule,
    GaleryKitchenModule,
    KitchenStudioModule,
    RegularClassModule,
    // MaterialModule,
    PrivateClassModule,
    BankModule,
    CertificateModule,
    KitchenStudioModule,
    GalleryKitchenModule,
    UsersPaymentModule,
    NotifikasiModule,
    MaterialModule,
    KitchenPaymentModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
