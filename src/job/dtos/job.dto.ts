import { Expose, Transform } from 'class-transformer';
import { JOB_TYPE } from '../job.entity';

export class JobDto {
  @Expose()
  title: string;

  @Expose()
  generalSummary: string;

  @Expose()
  description: string;

  @Expose()
  skill: string;

  @Expose()
  endedAt: Date;

  @Expose()
  address: string;

  @Expose()
  salary: number;

  @Expose()
  type: JOB_TYPE;

  @Transform(({ obj }) => obj.user?.id)
  @Expose()
  userId: number;

  @Transform(({ obj }) => obj.company?.id)
  @Expose()
  companyId: number;
}
