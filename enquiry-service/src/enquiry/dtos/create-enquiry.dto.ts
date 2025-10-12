import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  user_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  message?: string; // optional message

  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
