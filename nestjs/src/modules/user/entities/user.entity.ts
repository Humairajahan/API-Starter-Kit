import { CustomBaseEntity } from 'src/common/entities/custom-base.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user')
export class User extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  avatarURL: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
