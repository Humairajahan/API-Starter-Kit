import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PredefinedUserRoles } from './data/predefined-roles.enum';

@Injectable()
export class RoleService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   *
   * CREATE PREDEFINED USER ROLES
   *
   */
  async onApplicationBootstrap() {
    const roleExists = await this.roleRepository.find();
    if (roleExists.length == 0) {
      Object.values(PredefinedUserRoles).map(async (role) => {
        await this.roleRepository.save({ role: role });
      });
    }
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(uuid: string) {
    return await this.roleRepository.findOneBy({ uuid: uuid });
  }
}
