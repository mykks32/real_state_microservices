import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config.schema';

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<EnvSchema, true>) {}

  get dbUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }
}
