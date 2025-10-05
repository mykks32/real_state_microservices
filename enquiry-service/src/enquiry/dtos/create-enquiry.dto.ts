import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { RequestCreateEnquiryDto } from './request-create-enquiry.dto';

export class CreateEnquiryDto extends RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  property_id: string;
}
