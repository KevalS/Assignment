export class UserCreateDto {
  name!: string;
  email!: string;
  password!: string;
  phone!: string;
  role!: string;
}

export class UserUpdateDto {
  name?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
}

export class AuthLoginDto {
  email!: string;
  password!: string;
  deviceType?: DeviceType;
  deviceToken!: string;
}

export class CreateAccessToken {
  userId!: string;
  deviceType!: DeviceType;
  deviceToken!: string;
}

export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}
