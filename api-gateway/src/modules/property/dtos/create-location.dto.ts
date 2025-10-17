import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new location
 *
 * @class CreateLocationDTO
 * @description Used for creating location records with address and geographic coordinates
 *
 * @example
 * {
 *   address: "123 Main Street",
 *   city: "New York",
 *   state: "NY",
 *   country: "USA",
 *   zipcode: 10001,
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * }
 */
export class CreateLocationDTO {
  /**
   * Street address including building number and street name
   */
  @ApiProperty({
    description: 'Street address including building number and street name',
    example: '123 Main Street',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  /**
   * City name
   */
  @ApiProperty({
    description: 'City name',
    example: 'New York',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  /**
   * State or province code (2-letter abbreviation recommended)
   */
  @ApiProperty({
    description: 'State or province code (2-letter abbreviation recommended)',
    example: 'NY',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  /**
   * Country name
   */
  @ApiProperty({
    description: 'Country name',
    example: 'USA',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  /**
   * Postal or ZIP code
   */
  @ApiProperty({
    description: 'Postal or ZIP code',
    example: 10001,
    minimum: 1000,
    maximum: 99999,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1000)
  @Max(99999)
  zipcode: number;

  /**
   * Latitude coordinate (decimal degrees)
   * Optional but recommended for accurate geolocation
   */
  @ApiPropertyOptional({
    description: 'Latitude coordinate (decimal degrees)',
    example: 40.7128,
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
   * Optional but recommended for accurate geolocation
   */
  @ApiPropertyOptional({
    description: 'Longitude coordinate (decimal degrees)',
    example: -74.006,
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
