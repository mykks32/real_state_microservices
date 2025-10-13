import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvSchema } from './config.schema';

/** Provides type-safe DB config */
@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService<EnvSchema, true>) {}

  /** Auth service base URL from env */
  get authServiceUrl(): string {
    return this.config.get('AUTH_SERVICE_URL', { infer: true });
  }

  /** Enquiry service base URL from env */
  get enquiryServiceUrl(): string {
    return this.config.get('ENQUIRY_SERVICE_URL', { infer: true });
  }

  /** Property service base URL from env */
  get propertyServiceUrl(): string {
    return this.config.get('PROPERTY_SERVICE_URL', { infer: true });
  }
}
