import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { JOB_TYPE } from '../job.entity';

export class UpdateJobDto {
  @IsString()
  title: string;

  @IsString()
  generalSummary: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  skill: string;

  @IsDateString()
  endedAt: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @IsString()
  @IsEnum(JOB_TYPE)
  type: JOB_TYPE;

  @IsString()
  @IsNotEmpty()
  companyName: string;
}
