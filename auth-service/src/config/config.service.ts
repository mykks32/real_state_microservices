import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config.schema';

/** Provides type-safe DB config */
@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<EnvSchema, true>) {}

  get dbUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  get redisUrl(): string {
    return this.config.get('REDIS_URL', { infer: true });
  }
}
