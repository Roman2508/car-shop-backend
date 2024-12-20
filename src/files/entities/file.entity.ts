import { Column, Entity, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

import { AdvertisementEntity } from 'src/advertisement/entities/advertisement.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => AdvertisementEntity, (ad) => ad.photos, { onDelete: 'CASCADE' })
  ad: AdvertisementEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
