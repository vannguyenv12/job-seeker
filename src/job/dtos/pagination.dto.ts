import { Expose, Type } from 'class-transformer';
import { JobDto } from './job.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class PaginationDto {
  @Expose()
  @IsArray()
  @Type(() => JobDto)
  @ValidateNested()
  items: JobDto[];

  @Expose()
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
