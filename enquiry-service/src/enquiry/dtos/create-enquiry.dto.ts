import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  user_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  message?: string; // optional message
}

export class CreateEnquiryDto extends RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
