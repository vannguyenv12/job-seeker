import { ForbiddenException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

export class Permission {
  public static check(currentUser: User, userId: number) {
    for (const role of currentUser.roles) {
      if (role.name === 'ADMIN') return;
    }

    if (currentUser.id === userId) return;

    throw new ForbiddenException('User does not allow to perform action');
  }
}
