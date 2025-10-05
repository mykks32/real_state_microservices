import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsOptional()
  message?: string; // optional message
}

export class CreateEnquiryDto extends RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
