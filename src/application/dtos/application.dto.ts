import { Expose, Transform } from 'class-transformer';

export class ApplicationDto {
  @Expose()
  @Transform(({ obj }) => obj.job?.id)
  jobId: number;

  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userApplied: number;

  @Expose()
  createdAt: Date;
}
