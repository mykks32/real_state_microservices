import { Module } from '@nestjs/common';
import { PropertyController } from './controllers/property.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../../config/config.module';
import { PropertyUrlBuilder } from './utils/property-url.builder';
import { AdminPropertyController } from './controllers/admin-property.controller';
import { SellerPropertyController } from './controllers/seller-property.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [
    PropertyController,
    AdminPropertyController,
    SellerPropertyController,
  ],
  providers: [PropertyUrlBuilder],
})
export class PropertyModule {}
