import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDTO {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  zipcode: number;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}
