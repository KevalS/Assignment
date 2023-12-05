import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfigModule } from '../../config/user-config.module';
import { UserServiceUtilModule } from '../../common/utils/util.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserConfigModule,
    UserServiceUtilModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
