import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const permissions = this.reflector.get('type', context.getHandler());
      let isValid = false;
      const req = context.switchToHttp().getRequest();
      const headers = req.headers;
      let token = headers.authorization;
      if (!token) return reject(new UnauthorizedException());
      token = token.replace('Bearer ', '');
      let user;
      try {
        user = await firstValueFrom(
          this.userServiceClient.send('check_valid_user', { token }),
        );
      } catch (error) {
        Logger.error(error);
        return reject(new UnauthorizedException());
      }
      console.log(user);
      if (!user || !user.type) return reject(new UnauthorizedException());
      if (user.type === 'admin') isValid = true;
      else {
        for (const permission of permissions) {
          if (permission.type === user.type) {
            isValid = true;
            req.selfOnly = true;
            break;
          } else {
            isValid = false;
            continue;
          }
        }
      }
      if (!isValid) return reject(new UnauthorizedException());
      req.user = user;
      return resolve(isValid);
    });
  }
}
