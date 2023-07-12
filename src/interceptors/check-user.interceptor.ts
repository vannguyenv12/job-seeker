import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function CheckUser(user: any) {
  return UseInterceptors(new CheckUserInterceptor(user));
}

@Injectable()
export class CheckUserInterceptor implements NestInterceptor {
  constructor(private currentUser: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.currentUser.id !== this.currentUser.id) {
      throw new ForbiddenException('Not allow this user perform the action');
    }

    return next.handle();
  }
}
