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
import {
  LoggedInUserDto,
  UnifiedAuthResponseDto,
} from '../dto/unifiedAuthResponse.dto';
import { Role } from 'src/modules/role/entities/role.entity';
import { PredefinedUserRoles } from 'src/modules/role/data/predefined-roles.enum';
import { Response } from 'express';
import { cookieConfig } from 'src/config/cookie.config';

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
   * @param user - User entity
   * @returns LoggedInUserDto
   *
   */
  unifiedAuthResponse(user: User): LoggedInUserDto {
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
   * MANAGE COOKIES IN THE HTTP RESPONSE
   *
   * @param res - The HTTP response object
   * @param accessToken - The value for the `ACCESS_TOKEN` cookie
   * @param refreshToken - The value for the `REFRESH_TOKEN` cookie
   *
   */
  cookieManager(res: Response, accessToken: string, refreshToken: string) {
    ['ACCESS_TOKEN', 'REFRESH_TOKEN'].forEach((cookie) =>
      res.clearCookie(cookie),
    );

    res.cookie('ACCESS_TOKEN', accessToken, cookieConfig);
    res.cookie('REFRESH_TOKEN', refreshToken, cookieConfig);
  }

  /**
   *
   * SIGNUP
   *
   * @param signupDto
   * @returns
   */
  async signup(signupDto: SignupDto): Promise<UnifiedAuthResponseDto> {
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

    // GENERATE ACCESS TOKEN AND REFRESH TOKEN
    const accessToken = await this.customJwtService.generateJwtToken(user);
    const refreshToken = await this.customJwtService.generateRefreshToken(user);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: this.unifiedAuthResponse(user),
    };
  }

  /**
   *
   * GENERATE AND SEND AN ONE TIME VERIFICATION CODE VIA EMAIL
   *
   */
  async generateVerificationCode() {}

  /**
   *
   * LOGIN
   *
   * @param loginDto - User login credentials.
   * @returns UnifiedAuthResponseDto with user details
   *
   */
  async login(loginDto: LoginDto): Promise<UnifiedAuthResponseDto> {
    // EDGE CASE: USER WITH THIS EMAIL DOES NOT EXIST
    const userExists = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (!userExists) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    // PASSWORD VALIDATION
    const passwordValid: boolean = this.customJwtService.validatePassword(
      loginDto.password,
      userExists.password,
    );

    if (!passwordValid) {
      throw new HttpException(
        'Invalid user credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken =
      await this.customJwtService.generateJwtToken(userExists);
    const refreshToken =
      await this.customJwtService.generateRefreshToken(userExists);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: this.unifiedAuthResponse(userExists),
    };
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
