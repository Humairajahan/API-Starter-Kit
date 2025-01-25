import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CustomJwtService } from '../auth/service/custom-jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [SeedService, CustomJwtService],
})
export class SeedModule {}
