import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/lib/entities/user.entity';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user }: { user: UserEntity } = request;
    const { userId }: { userId: string } = request.params;

    if (user.id !== +userId) {
      return false;
    }

    return true;
  }
}
