import { EnquiryStatus } from './enums/enquiry-status.enum';

export interface IEnquiry {
  enquiry_id: string;
  property_id: string;
  user_id: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: Date;
}
