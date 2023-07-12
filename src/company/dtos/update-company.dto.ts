import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
