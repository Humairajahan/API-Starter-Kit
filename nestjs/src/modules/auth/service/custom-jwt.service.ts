import { Injectable } from '@nestjs/common';
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
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * Encodes a plaintext password to ciphertext by hashing it with a generated salt.
   *
   * @param password - The plaintext password to be hashed.
   * @returns A promise that resolves to the hashed password as a string.
   *
   */
  async encodePassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    return hashSync(password, salt);
  }
}
