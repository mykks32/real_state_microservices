import { EnquiryStatus } from '../enums/enquiry-status.enum';

/** Represents a Enquiry Entity. */
export interface IEnquiry {
  enquiry_id: string;
  property_id: string;
  user_id: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: Date;
}
