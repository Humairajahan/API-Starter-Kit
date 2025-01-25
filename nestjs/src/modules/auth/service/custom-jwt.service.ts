import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hashSync } from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomJwtService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * ENCODES A PLAINTEXT PASSWORD TO A CIPHERTEXT BY HASHING IT WITH A GENERATED SALT.
   *
   * @param password - The plaintext password to be hashed.
   * @returns A promise that resolves to the hashed password as a string.
   *
   */
  async encodePassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    return hashSync(password, salt);
  }

  /**
   *
   * GENERATES JWT ACCESS TOKEN EXPIRING IN 1 HOUR (3600 sec)
   *
   * @param user - User object
   * @returns A promise that resolves to the access token as a string.
   *
   */
  async generateJwtToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email };
    const expiresIn = this.configService.get<number>('APP_EXPIRES_IN', 3600);
    return await this.jwtService.signAsync(payload, { expiresIn: expiresIn });
  }

  /**
   *
   * GENERATES REFRESH TOKEN EXPIRING IN 7 DAYS ( 3600 * 24 * 7 SEC)
   *
   * @param user - User object
   * @returns A promise that resolves to the refresh token as a string.
   *
   */
  async generateRefreshToken(user: User): Promise<string> {
    const payload = { id: user.id, email: user.email };
    const expiresIn = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_IN',
      604800,
    );
    return await this.jwtService.signAsync(payload, { expiresIn: expiresIn });
  }
}
