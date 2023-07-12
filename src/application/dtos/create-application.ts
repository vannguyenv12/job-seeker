import { IsNumber, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  jobId: number;
}
