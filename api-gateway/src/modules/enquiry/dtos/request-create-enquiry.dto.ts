import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateEnquiryDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  message?: string; // optional message

  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
