import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../interfaces/user.interface";

@Entity()
export class User extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string

    @Column({
        unique: true,
        nullable: true
    })
    username: string;

    @Column()
    password: string;

    @Column({
        default: false
    })
    IsAdmin: boolean;

    @Column()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null;

}