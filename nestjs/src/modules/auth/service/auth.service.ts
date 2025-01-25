import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor() {}
  signup(signupDto: SignupDto) {
    return 'This action creates a new user';
  }

  login(loginDto: LoginDto) {
    return 'This action logs in a user with valid credentials.';
  }

  verifyAccount(uuid: string, verifyAccountDto: VerifyAccountDto) {
    return 'This action verifies a user account using a verification token.';
  }

  forgotPassword(uuid: string, forgotPasswordDto: ForgotPasswordDto) {
    return "This action sends a password reset link to the user's email.";
  }

  resetPassword(uuid: string, resetPasswordDto: ResetPasswordDto) {
    return 'This action allows the user to reset their password using a valid token.';
  }
}
