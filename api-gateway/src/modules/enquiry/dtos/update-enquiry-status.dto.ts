import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnquiryStatus } from '../enums/enquiry-status.enum';

export class UpdateEnquiryStatusDto {
  @ApiProperty({
    enum: EnquiryStatus,
    description: 'New status for the enquiry',
  })
  @IsEnum(EnquiryStatus)
  @IsNotEmpty()
  status: EnquiryStatus;
}
