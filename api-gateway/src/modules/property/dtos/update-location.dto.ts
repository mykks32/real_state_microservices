import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { StateEnum } from '../enums/state.enum';

export class UpdateLocationDTO {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(StateEnum, { message: 'Invalid state value' })
  state?: StateEnum;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  zipcode?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
