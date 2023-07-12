import { Expose } from 'class-transformer';

export class CompanyDto {
  @Expose()
  name: string;
}
