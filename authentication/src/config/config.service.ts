import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config.schema';

/** Provides type-safe DB config */
@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<EnvSchema, true>) {}

  get dbHost(): string {
    return this.config.get('DATABASE_HOST', { infer: true });
  }

  get dbPort(): number {
    return Number(this.config.get('DATABASE_PORT', { infer: true }));
  }

  get dbUser(): string {
    return this.config.get('DATABASE_USER', { infer: true });
  }

  get dbName(): string {
    return this.config.get('DATABASE_NAME', { infer: true });
  }
}
