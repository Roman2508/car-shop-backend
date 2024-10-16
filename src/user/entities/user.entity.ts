import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { DialogEntity } from 'src/dialogs/entities/dialog.entity';
import { AdvertisementEntity } from 'src/advertisement/entities/advertisement.entity';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Max(40)
  @Column()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Min(6)
  @Max(30)
  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ default: '' })
  avatarUrl: string;

  @Column()
  @Column({ default: null })
  phone?: number;

  @Column({ type: 'enum', enum: UserRoles })
  role: UserRoles;

  @ManyToMany(() => DialogEntity, (dialog) => dialog.members)
  @JoinColumn({ name: 'dialogs' })
  dialogs: DialogEntity[];

  @OneToMany(() => AdvertisementEntity, (ad) => ad.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'advertisements' })
  advertisements: AdvertisementEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
