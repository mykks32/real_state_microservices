import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IEnquiry } from 'src/enquiry/interfaces/enquiry.interface';
import { EnquiryStatus } from 'src/enquiry/enums/enquiry-status.enum';

@Entity('enquiry')
export class Enquiry extends BaseEntity implements IEnquiry {
  @PrimaryGeneratedColumn('uuid')
  enquiry_id: string;

  @Column({ type: 'uuid', nullable: false })
  property_id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: EnquiryStatus,
    default: EnquiryStatus.IN_PROGRESS,
    nullable: false,
  })
  status: EnquiryStatus;

  @CreateDateColumn()
  createdAt: Date;
}
