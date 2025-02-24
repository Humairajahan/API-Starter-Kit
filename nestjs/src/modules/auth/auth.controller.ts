import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { UnifiedAuthResponseDto } from './dto/unifiedAuthResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() singupDto: SignupDto, @Res() res: Response) {
    const signupResponse: UnifiedAuthResponseDto =
      await this.authService.signup(singupDto);

    this.authService.cookieManager(
      res,
      signupResponse.accessToken,
      signupResponse.refreshToken,
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Signup successful',
      status: HttpStatus.CREATED,
      result: signupResponse.data,
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const loginResponse: UnifiedAuthResponseDto =
      await this.authService.login(loginDto);

    this.authService.cookieManager(
      res,
      loginResponse.accessToken,
      loginResponse.refreshToken,
    );

    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      status: HttpStatus.OK,
      result: loginResponse.data,
    });
  }

  @Post('verify:uuid')
  verifyAccount(
    @Param('uuid') uuid: string,
    @Body() verifyAccountDto: VerifyAccountDto,
  ) {
    return this.authService.verifyAccount(uuid, verifyAccountDto);
  }

  @Post('forgot-password:uuid')
  forgotPassword(
    @Param('uuid') uuid: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(uuid, forgotPasswordDto);
  }

  @Post('reset-password:uuid')
  resetPassword(
    @Param('uuid') uuid: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(uuid, resetPasswordDto);
  }
}
