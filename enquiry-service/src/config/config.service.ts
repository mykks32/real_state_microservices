import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config.schema';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

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

  get dbPass(): string {
    return this.config.get('DATABASE_PASS', { infer: true });
  }

  get dbName(): string {
    return this.config.get('DATABASE_NAME', { infer: true });
  }
}
