import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('enquiry')
export class Enquiry {
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
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress',
    nullable: false,
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
