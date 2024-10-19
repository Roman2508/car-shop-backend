import { UserEntity } from 'src/user/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { AdvertisementEntity } from 'src/advertisement/entities/advertisement.entity';
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dialogs')
export class DialogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, (user) => user.dialogs)
  @JoinTable({ name: 'members' })
  members: UserEntity[];

  @ManyToOne(() => AdvertisementEntity, (ad) => ad.id)
  @JoinColumn({ name: 'advertisement' })
  advertisement: AdvertisementEntity;

  @OneToMany(() => MessageEntity, (message) => message.dialog)
  @JoinColumn({ name: 'messages' })
  messages: MessageEntity[];
}
