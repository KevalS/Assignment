import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '../common/validators/enums';

export class RequestInformation {
  user!: any;
  selfOnly!: boolean;
  body?: Body;
  params?: any;
  query: any;
}

export class UserCreateDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Jon',
    required: true,
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'snow@dkod3.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'changeme',
    minLength: 6,
    maxLength: 30,
    required: true,
  })
  @IsOptional()
  @MinLength(6)
  @MaxLength(30)
  password?: string;

  @ApiProperty({
    description: 'phone number of the user',
    example: '+918931097382',
    minLength: 13,
    maxLength: 13,
  })
  @MinLength(13)
  @MaxLength(13)
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: 'Role',
    example: 'admin',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  type!: string;
}

export class UserLoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'snow@dkod3.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'changeme',
    minLength: 6,
    maxLength: 30,
  })
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ enum: ['android', 'ios', 'web'] })
  @IsEnum(DeviceType)
  @IsString()
  @IsNotEmpty()
  deviceType!: string;
}

export class UserUpdateDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Jon',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'snow@dkod3.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'phone number of the user',
    example: '+918931097382',
    minLength: 13,
    maxLength: 13,
  })
  @MinLength(13)
  @MaxLength(13)
  @IsOptional()
  phone?: string;
}
