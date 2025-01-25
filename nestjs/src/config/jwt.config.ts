import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      global: true,
      secret: configService.get<string>('APP_SECRET'),
      signOptions: {
        expiresIn: configService.get<number>('APP_EXPIRES_IN', 3600),
      },
    };
  },
};
