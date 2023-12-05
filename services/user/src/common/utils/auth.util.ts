import { Injectable } from '@nestjs/common';
import { UserServiceConfig } from '../../config/user-config.service';
import * as jwt from 'jsonwebtoken';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthUtil {
  constructor(private readonly userConfigService: UserServiceConfig) {}
  signJwt(options: any) {
    return jwt.sign(options, this.userConfigService.auth.jwtSecret, {
      expiresIn: this.userConfigService.auth.jwtExpTime,
    });
  }

  verifyJwt(token: string) {
    try {
      return jwt.verify(token, this.userConfigService.auth.jwtSecret);
    } catch (error: any) {
      error.statusCode = 401;
      if (error.message === 'jwt malformed') error.message = 'Invalid Token';
      throw new RpcException(error);
    }
  }

  getOtp() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
