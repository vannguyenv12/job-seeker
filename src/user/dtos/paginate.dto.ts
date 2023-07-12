import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';

export class PaginationDto {
  @Expose()
  @IsArray()
  @Type(() => UserDto)
  @ValidateNested()
  items: UserDto[];

  @Expose()
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
