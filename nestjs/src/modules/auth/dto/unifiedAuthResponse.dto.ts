export class UnifiedAuthResponseDto {
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
