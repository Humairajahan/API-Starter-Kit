import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PredefinedUserRoles } from '../data/predefined-roles.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('role')
export class Role extends CustomBaseEntity {
  @Column({
    type: 'enum',
    enum: PredefinedUserRoles,
    default: PredefinedUserRoles.USER,
  })
  role: PredefinedUserRoles;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
