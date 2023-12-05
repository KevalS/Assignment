import { Global, Module } from '@nestjs/common';
import { UserConfigModule } from '../../config/user-config.module';
import { AuthUtil } from './auth.util';
@Global()
@Module({
  imports: [UserConfigModule],
  providers: [AuthUtil],
  exports: [AuthUtil],
})
export class UserServiceUtilModule {}
