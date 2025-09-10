import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUsers } from '../interfaces/user.interface';

@Entity()
export class Users extends BaseEntity implements IUsers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({
    unique: true,
    nullable: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  IsAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;
}
