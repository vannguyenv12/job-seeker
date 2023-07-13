import { Application } from 'src/application/application.entity';
import { Job } from 'src/job/job.entity';
import { Role } from 'src/role/role.entity';
import { Skill } from 'src/skill/skill.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @ManyToMany(() => Skill)
  @JoinTable({ name: 'users_skills' })
  skills: Skill[];
}
