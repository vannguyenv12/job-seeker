import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    for (const role of request.currentUser.roles) {
      if (!this.roles.includes(role.name)) {
        throw new ForbiddenException(
          'User is not logged or do not have a permission',
        );
      }
    }

    return true;
  }
}
