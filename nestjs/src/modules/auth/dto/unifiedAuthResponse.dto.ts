import { IsObject, IsString } from '@nestjs/class-validator';

export class LoggedInUserDto {
  id: number;
  uuid: string;
  username: string;
  name: string;
  email: string;
  avatarURL: string;
  isVerified: boolean;
  userRole: string;
  userRoleUUID: string;
}

export class UnifiedAuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsObject()
  data: LoggedInUserDto;
}
