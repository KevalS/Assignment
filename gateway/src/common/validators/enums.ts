export enum DeviceType {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

export class EndPointPermissions {
  type!: string; // module name
  selfOnly?: boolean; // to get self data only
}

export enum EnableOrDisable {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

export class RequestData {
  user: any;
  body: any;
  params: any;
  query: any;
  selfOnly!: boolean;
}
