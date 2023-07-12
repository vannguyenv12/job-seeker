import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApplicationDto } from './application.dto';

export class PaginationDto {
  @Expose()
  @IsArray()
  @Type(() => ApplicationDto)
  @ValidateNested()
  items: ApplicationDto[];

  @Expose()
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
