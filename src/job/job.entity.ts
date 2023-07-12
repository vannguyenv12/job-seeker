import { Company } from 'src/company/company.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JOB_TYPE {
  PART_TIME = 'PART_TIME',
  FULL_TIME = 'FULL_TIME',
  INTERNSHIP = 'INTERNSHIP',
  REMOTE = 'REMOTE',
}

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  generalSummary: string;

  @Column()
  description: string;

  @Column()
  skill: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  endedAt: Date;

  @Column()
  address: string;

  @Column()
  salary: number;

  @Column({ default: JOB_TYPE.FULL_TIME })
  type: JOB_TYPE;

  @ManyToOne(() => User, (user) => user.jobs)
  user: User;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  company: Company;
}
