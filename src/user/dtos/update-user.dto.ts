import { IsArray, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsArray()
  skills: [string];
}
