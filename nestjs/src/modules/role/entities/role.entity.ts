import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { Column, Entity } from 'typeorm';
import { PredefinedUserRoles } from '../data/predefined-roles.enum';

@Entity('role')
export class Role extends CustomBaseEntity {
  @Column({
    type: 'enum',
    enum: PredefinedUserRoles,
    default: PredefinedUserRoles.USER,
  })
  role: PredefinedUserRoles;
}
