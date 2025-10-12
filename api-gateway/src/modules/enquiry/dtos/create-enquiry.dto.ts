import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestCreateEnquiryDto } from './request-create-enquiry.dto';

export class CreateEnquiryDto extends RequestCreateEnquiryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  user_id: string;
}
