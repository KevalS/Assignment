import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto, CreateAccessToken, UserCreateDto } from './user.dto';
import { User } from './user.entity';
import { UserServiceConfig } from '../../config/user-config.service';
import { AuthUtil } from '../../common/utils/auth.util';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userConfigService: UserServiceConfig,
    private readonly autService: AuthUtil,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      this.userConfigService.auth.bcryptRounds,
    );
  }

  createAccessToken(options: CreateAccessToken) {
    return {
      accessToken: this.autService.signJwt(options),
      deviceType: options.deviceType,
      userId: options.userId,
      deviceToken: options.deviceToken,
    };
  }

  async verifyAccessToken(options: any) {
    const jwtData = this.autService.verifyJwt(options.token);
    const userId = _.get(jwtData, 'userId');
    const user = await this.userRepository.findOne({
      id: userId,
      isDeleted: false,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.password']) // added selection
      .where('user.email = :email', { email: authLoginDto.email })
      .getOne();

    if (!user || user.isDeleted)
      return new BadRequestException('Invalid credentials');

    const isValid = await bcrypt.compare(authLoginDto.password, user.password);
    if (!isValid) throw new BadRequestException('Invalid credentials');
    const token = this.createAccessToken({
      userId: user.id,
      deviceToken: authLoginDto.deviceToken,
      deviceType: authLoginDto.deviceType!,
    });
    const loginData = { token, role: user.type };
    return loginData;
  }

  profile() {
    return this.userRepository.findOne({
      where: { email: 'authLoginDto.email' },
    });
  }

  async updateUser(data: any, id: any): Promise<any> {
    const user = await this.userRepository.findOne(id);
    delete data.password;
    delete data.role;
    delete data.id;
    if (!user) return new NotFoundException('No User Found');
    return this.userRepository.update(id, data);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(id: string): Promise<any> {
    return this.userRepository.findOne(id);
  }

  async search(options: any): Promise<any> {
    const { query, requestInfo } = options;
    if (requestInfo.selfOnly) {
      return await this.userRepository
        .createQueryBuilder('user')
        .where('user.name like :name', { name: `%${query.searchString}%` })
        .where({ customer: requestInfo.user.id })
        .getMany();
    }
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.name like :name', { name: `%${query.searchString}%` })
      .getMany();
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const hash = await this.hashPassword(userCreateDto.password);
    const user = new User();
    Object.assign(user, userCreateDto);
    user.password = hash;
    const alreadyExitsUser = await this.userRepository.findOne({
      where: { email: userCreateDto.email },
      select: ['email'],
    });

    if (alreadyExitsUser) {
      throw new BadRequestException('Email Already Taken');
    }
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<any> {
    console.log(id);
    return this.userRepository.update(id, { isDeleted: true });
  }
}
