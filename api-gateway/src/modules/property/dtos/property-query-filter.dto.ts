import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyFilterQueryDto {
  /**
   * Property status filter
   * @example "Available"
   */
  @ApiProperty({
    description: 'Property status',
    enum: ['Available', 'Rented', 'Sold'],
    required: false,
    example: 'Available',
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['Available', 'Rented', 'Sold'], {
    message: 'Status must be one of: Available, Rented, Sold',
  })
  status?: string;

  /**
   * Property type filter
   * @example "House"
   */
  @ApiProperty({
    description: 'Property type',
    enum: ['House', 'Land'],
    required: false,
    example: 'House',
  })
  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  @IsIn(['House', 'Land'], {
    message: 'Type must be one of: House, Land',
  })
  type?: string;

  /**
   * Location state filter
   * @example "Bagmati"
   */
  @ApiProperty({
    description: 'Location state',
    enum: [
      'Koshi',
      'Madhesh',
      'Bagmati',
      'Gandaki',
      'Lumbini',
      'Karnali',
      'Sudurpashchim',
    ],
    required: false,
    example: 'Bagmati',
  })
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  @IsIn(
    [
      'Koshi',
      'Madhesh',
      'Bagmati',
      'Gandaki',
      'Lumbini',
      'Karnali',
      'Sudurpashchim',
    ],
    {
      message:
        'State must be one of: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim',
    },
  )
  state?: string;

  /**
   * Page number (0-indexed)
   * @example 0
   */
  @ApiProperty({
    description: 'Page number (0-indexed)',
    type: Number,
    required: false,
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(0, { message: 'Page must be greater than or equal to 0' })
  page?: number = 0;

  /**
   * Number of items per page
   * @example 10
   */
  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    required: false,
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Size must be a number' })
  @Min(1, { message: 'Size must be at least 1' })
  @Max(100, { message: 'Size cannot exceed 100' })
  size?: number = 10;
}
