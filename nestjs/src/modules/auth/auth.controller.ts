import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() singupDto: SignupDto) {
    return this.authService.signup(singupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
