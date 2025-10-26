import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TypeEnum } from '../enums/type.enum';
import { StatusEnum } from '../enums/status.enum';
import { Type } from 'class-transformer';
import { CreateLocationDTO } from './create-location.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new property request
 *
 * @class RequestCreatePropertyDTO
 * @description Used for creating property records with comprehensive details including location
 *
 * @example
 * {
 *   title: "Beautiful Modern Apartment in Downtown",
 *   description: "A stunning 2-bedroom apartment with city views",
 *   type: "APARTMENT",
 *   status: "AVAILABLE",
 *   location: {
 *     address: "123 Main Street",
 *     city: "New York",
 *     state: "NY",
 *     country: "USA",
 *     zipcode: 10001,
 *     latitude: 40.7128,
 *     longitude: -74.0060
 *   }
 * }
 */
export class RequestCreatePropertyDTO {
  /**
   * Property title or name
   */
  @ApiProperty({
    description: 'Property title or name',
    example: 'Beautiful Modern Apartment in Downtown',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title: string;

  /**
   * Detailed property description
   */
  @ApiPropertyOptional({
    description: 'Detailed property description',
    example:
      'A stunning 2-bedroom apartment with city views and modern amenities',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  /**
   * Type of property
   */
  @ApiProperty({
    description: 'Type of property',
    enum: TypeEnum,
    example: TypeEnum.Land,
    default: TypeEnum.Land,
  })
  @IsEnum(TypeEnum, { message: 'Property type is required' })
  type: TypeEnum = TypeEnum.Land;

  /**
   * Current availability status of the property
   */
  @ApiProperty({
    description: 'Current availability status of the property',
    enum: StatusEnum,
    example: StatusEnum.Available,
    default: StatusEnum.Available,
  })
  @IsEnum(StatusEnum, { message: 'Property status is required' })
  status: StatusEnum = StatusEnum.Available;

  /**
   * Location details of the property
   */
  @ApiProperty({
    description: 'Location details of the property',
    type: CreateLocationDTO,
  })
  @ValidateNested()
  @Type(() => CreateLocationDTO)
  location: CreateLocationDTO;
}
