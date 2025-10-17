import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { StateEnum } from '../enums/state.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating location information
 *
 * @class UpdateLocationDTO
 * @description Used for partial updates to location records. All fields are optional.
 *
 * @example
 * {
 *   address: "456 Updated Street",
 *   city: "Los Angeles",
 *   state: "CA",
 *   zipcode: 90210,
 *   latitude: 34.0522,
 *   longitude: -118.2437
 * }
 *
 * @example
 * {
 *   city: "San Francisco",
 *   state: "CA"
 * }
 */
export class UpdateLocationDTO {
  /**
   * Street address including building number and street name
   */
  @ApiPropertyOptional({
    description: 'Street address including building number and street name',
    example: '456 Updated Street',
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  address?: string;

  /**
   * City name
   */
  @ApiPropertyOptional({
    description: 'City name',
    example: 'Los Angeles',
    maxLength: 100,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  city?: string;

  /**
   * State or province
   */
  @ApiPropertyOptional({
    description: 'State or province',
    enum: StateEnum,
    example: StateEnum.Madhesh,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(StateEnum, { message: 'Invalid state value' })
  state?: StateEnum;

  /**
   * Country name
   */
  @ApiPropertyOptional({
    description: 'Country name',
    example: 'USA',
    maxLength: 100,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  country?: string;

  /**
   * Postal or ZIP code
   */
  @ApiPropertyOptional({
    description: 'Postal or ZIP code',
    example: 90210,
    minimum: 1000,
    maximum: 99999,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1000)
  @Max(99999)
  zipcode?: number;

  /**
   * Latitude coordinate (decimal degrees)
   */
  @ApiPropertyOptional({
    description: 'Latitude coordinate (decimal degrees)',
    example: 34.0522,
    minimum: -90,
    maximum: 90,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  /**
   * Longitude coordinate (decimal degrees)
   */
  @ApiPropertyOptional({
    description: 'Longitude coordinate (decimal degrees)',
    example: -118.2437,
    minimum: -180,
    maximum: 180,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
