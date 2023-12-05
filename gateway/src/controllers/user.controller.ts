import {
  Body,
  Delete,
  Param,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
// import { HttpException } from '@nestjs/common';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../auth/role.decorator';
import {
  RequestInformation,
  UserCreateDto,
  UserLoginDto,
  UserUpdateDto,
} from '../dtos/user.dto';

@Controller('Users')
@ApiTags('Users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @ApiBody({ type: UserCreateDto })
  @ApiCreatedResponse({
    description: 'SignUp successful',
  })
  @Post('/Signup')
  async signup(@Req() req: RequestInformation) {
    return firstValueFrom(
      this.userServiceClient.send('user_signup', { body: req.body }),
    );
  }

  @ApiBody({ type: UserLoginDto })
  @ApiCreatedResponse()
  @Post('/Login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return firstValueFrom(this.userServiceClient.send('Login', userLoginDto));
  }

  @ApiBearerAuth('Authorization')
  @Auth({ type: 'default', selfOnly: true })
  @Get('/Profile')
  async profile(@Req() request: any) {
    return request.user;
  }

  @ApiBody({ type: UserCreateDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @Post('/')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  async createUser(@Body() userCreateDto: UserCreateDto, @Req() req: any) {
    const requestInfo = { selfOnly: req.selfOnly, user: req.user };
    return firstValueFrom(
      this.userServiceClient.send('user_create', {
        body: userCreateDto,
        requestInfo,
      }),
    );
  }

  @Get('/')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  async getUsers(@Req() req: any) {
    const requestInfo = { selfOnly: req.selfOnly, user: req.user };
    return firstValueFrom(
      this.userServiceClient.send('user_get_all', { requestInfo }),
    );
  }

  @Get('/Search')
  @ApiBearerAuth('Authorization')
  @ApiQuery({ name: 'searchString', type: 'string' })
  @Auth({ type: 'admin' })
  async search(@Req() req: any, @Query() query: any) {
    const requestInfo = { selfOnly: req.selfOnly, user: req.user };
    return firstValueFrom(
      this.userServiceClient.send('user_search', { requestInfo, query }),
    );
  }

  @Put('/')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  @ApiBody({ type: UserUpdateDto })
  async updateUser(
    @Req() req: any,
    @Body() userUpdateDto: UserUpdateDto,
    @Query('userId') userId: string,
  ) {
    const requestInfo = { selfOnly: req.selfOnly, user: req.user };
    return firstValueFrom(
      this.userServiceClient.send('user_update', {
        userUpdateDto,
        userId,
        requestInfo,
      }),
    );
  }

  @Get('/:userId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' }, { type: 'default' })
  async getUser(@Param('userId') userId: string, @Req() req: any) {
    if (userId !== req.user.id && req.selfOnly) {
      throw new UnauthorizedException();
    }
    return firstValueFrom(
      this.userServiceClient.send('user_get_by_id', { userId }),
    );
  }
  @Delete('/:userId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  async deleteUser(@Param('userId') userId: string) {
    return firstValueFrom(
      this.userServiceClient.send('delete_user', { params: { userId } }),
    );
  }
}
