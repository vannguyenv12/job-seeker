import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { Unique } from 'typeorm';
import { Company } from '../company.entity';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @Validate(Unique, [Company, 'name']) // search name and check unique
  name: string;
}
