import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CustomJwtService } from './custom-jwt.service';
import { UnifiedAuthResponseDto } from '../dto/unifiedAuthResponse.dto';
import { Role } from 'src/modules/role/entities/role.entity';
import { PredefinedUserRoles } from 'src/modules/role/data/predefined-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly customJwtService: CustomJwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   *
   * GENERATES AN UNIFIED AUTHENTICATION RESPONSE
   *
   * @param user
   * @param accessToken
   * @returns
   *
   */
  unifiedAuthResponse(user: User): UnifiedAuthResponseDto {
    return {
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      isVerified: user.isVerified,
      userRole: user.role.role,
      userRoleUUID: user.role.uuid,
    };
  }

  /**
   *
   * SIGNUP
   *
   * @param signupDto
   * @returns
   */
  async signup(signupDto: SignupDto) {
    // EDGE CASE: PASSWORDS DO NOT MATCH
    if (signupDto.password != signupDto.confirmPassword) {
      throw new HttpException('Password mismatched', HttpStatus.BAD_REQUEST);
    }

    // EDGE CASE: USER WITH THIS EMAIL ALREADY EXISTS
    const userExists = await this.userRepository.findOneBy({
      email: signupDto.email,
    });
    if (userExists) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // RETRIEVE USER ROLE TO MAP WITH THE USER
    const role = await this.roleRepository.findOneBy({
      role: PredefinedUserRoles.USER,
    });
    if (!role) {
      throw new HttpException(
        'User role does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ENCODE PASSWORD
    const hashedPassword = await this.customJwtService.encodePassword(
      signupDto.password,
    );

    // GENERATE AND SEND AN ONE TIME VERIFICATION CODE VIA EMAIL
    await this.generateVerificationCode();

    // CREATE USER OBJECT
    const user = new User();
    user.username = signupDto.username;
    user.name = signupDto.name;
    user.email = signupDto.email;
    user.password = hashedPassword;
    user.role = role;
    await this.userRepository.save(user);
    return {
      message: 'Signup succeessful',
      status: HttpStatus.CREATED,
      result: this.unifiedAuthResponse(user),
    };
  }

  /**
   *
   * GENERATE AND SEND AN ONE TIME VERIFICATION CODE VIA EMAIL
   *
   */
  async generateVerificationCode() {}

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
