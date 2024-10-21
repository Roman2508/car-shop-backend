import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { FileEntity } from 'src/files/entities/file.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { DialogEntity } from 'src/dialogs/entities/dialog.entity';

@Entity('advertisement')
export class AdvertisementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: null })
  description: string;

  @Column()
  price: number;

  // АКТИВНЕ | НЕАКТИВНЕ | ОЧІКУЄ ПІДТВЕРДЖЕННЯ
  @Column({ default: 'ОЧІКУЄ ПІДТВЕРДЖЕННЯ' })
  status: string;

  @Column()
  category: string;

  @Column()
  subcategory: string;

  @Column()
  carType: string;

  @Column()
  mileage: number;

  @Column()
  сustomsСleared: string;

  @Column({ default: null })
  engineVolume?: number;

  @Column({ default: null })
  theCarWasDrivenFrom?: string;

  @Column()
  model: string;

  @Column()
  yearOfRelease: number;

  @Column()
  carBodyType: string;

  @Column({ default: null })
  seatsCount?: string;

  @Column()
  color: string;

  @Column()
  gearbox: string;

  @Column()
  driveType: string;

  @Column()
  fuelType: string;

  @Column()
  varnishCoating: string;

  // @Column('simple-json', { default: [] })
  @Column('text', { array: true, default: [] })
  technicalCondition: string[];

  @Column('text', { array: true, default: [] })
  comfort?: string[];

  @Column('text', { array: true, default: [] })
  multimedia?: string[];

  @Column('text', { array: true, default: [] })
  security?: string[];

  @OneToMany(() => FileEntity, (file) => file.ad)
  // @JoinColumn({ name: 'photos' })
  photos: FileEntity[];

  @ManyToOne(() => UserEntity, (user) => user.advertisements)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  // @OneToMany(() => DialogEntity, (dialog) => dialog.advertisement)
  // @JoinColumn({ name: 'dialogs' })
  // dialogs: DialogEntity[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
