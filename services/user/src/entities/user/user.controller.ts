import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthLoginDto, UserCreateDto } from './user.dto';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { RequestData } from '../../common/validators/req.info';

@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('check_valid_user')
  async validUser(options: any) {
    return this.userService.verifyAccessToken(options);
  }

  @MessagePattern('Login')
  async login(authLoginDto: AuthLoginDto) {
    return this.userService.login(authLoginDto);
  }

  @MessagePattern('profile')
  async profile() {
    return this.userService.profile();
  }

  @MessagePattern('user_update')
  async updateUser(options: RequestData) {
    return this.userService.updateUser(options.body, options.params.userId);
  }

  @MessagePattern('user_get_all')
  async getUsers() {
    return this.userService.getUsers();
  }

  @MessagePattern('user_get_by_id')
  async getUser(options: any) {
    const id: string = _.get(options, 'userId');
    return this.userService.getUser(id);
  }

  @MessagePattern('user_search')
  async search(options: any) {
    return this.userService.search(options);
  }

  @MessagePattern('user_signup')
  async signup(options: RequestData) {
    const userCreateDto: UserCreateDto = options.body;
    return this.userService.createUser(userCreateDto);
  }
  @MessagePattern('user_create')
  async create(options: RequestData) {
    const userCreateDto: UserCreateDto = options.body;
    return this.userService.createUser(userCreateDto);
  }
  @MessagePattern('delete_user')
  async delete(options: RequestData) {
    const userId: string = _.get(options.params, 'userId');
    return this.userService.deleteUser(userId);
  }
}
