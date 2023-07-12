import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinDate,
} from 'class-validator';
import { JOB_TYPE } from '../job.entity';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
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

  userId: number;
}
