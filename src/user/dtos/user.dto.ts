import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;

  @Expose()
  @Transform(({ obj }) => obj?.skills?.map((skill) => skill.name))
  skills: [string];

  @Expose()
  accessToken: string;
}
