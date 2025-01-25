import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { PredefinedUserRoles } from '../role/data/predefined-roles.enum';
import { ConfigService } from '@nestjs/config';
import { CustomJwtService } from '../auth/service/custom-jwt.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    private readonly customJwtService: CustomJwtService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * SEED USER ROLES AND SUPERADMIN USER ON APPLICATION BOOTSTRAP
   *
   */
  async onApplicationBootstrap() {
    await this.seedPredefinedUserRoles();
    await this.seedSuperAdminUser();
  }

  /**
   *
   * SEED PREDEFINED USER ROLES
   *
   */
  async seedPredefinedUserRoles() {
    const rolesToSeed = Object.values(PredefinedUserRoles);

    const existingRoles = await this.roleRepository.find();

    const existingRoleName = new Set(existingRoles.map((role) => role.role));

    const rolesToSave = rolesToSeed.filter(
      (role) => !existingRoleName.has(role),
    );

    if (rolesToSave.length > 0) {
      await this.roleRepository.save(
        rolesToSave.map((role) => ({ role: role })),
      );
    }
  }

  /**
   *
   * SEED SUPERADMIN USER
   *
   */
  async seedSuperAdminUser() {
    const superAdminEmail = this.configService.get<string>(
      'SUPERADMIN_EMAIL',
      'admin@gmail.com',
    );

    const userExists = await this.userRepository.findOneBy({
      email: superAdminEmail,
    });

    const superAdminRole = await this.roleRepository.findOneBy({
      role: PredefinedUserRoles.SUPERADMIN,
    });

    if (!userExists && superAdminRole) {
      const superAdminUser = new User();
      superAdminUser.username = 'superadmin';
      superAdminUser.name = 'Admin';
      superAdminUser.email = superAdminEmail;
      superAdminUser.password = await this.customJwtService.encodePassword(
        this.configService.get<string>('SUPERADMIN_PASSWORD', '123456'),
      );
      superAdminUser.role = superAdminRole;

      await this.userRepository.save(superAdminUser);
    }
  }
}
