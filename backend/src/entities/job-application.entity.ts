import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User, UserRole } from './user.entity';

export enum ApplicationStatus {
  REVIEW = 'under_review',
  INTERVIEW = 'interview',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  applyingForRole: UserRole;

  @Column({ nullable: true })
  resumeUrl: string;

  // e.g., driver's license URL, vehicle plate number
  @Column('jsonb', { nullable: true })
  documents: Record<string, string>;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.REVIEW,
  })
  status: ApplicationStatus;

  // The HR rep handling it
  @ManyToOne(() => User, { nullable: true })
  reviewedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
