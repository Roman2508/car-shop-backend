import { UserEntity } from 'src/user/entities/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('dialogs')
export class DialogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => UserEntity, (user) => user.dialogs)
  @JoinColumn({ name: 'members' })
  members: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.dialog)
  @JoinColumn({ name: 'messages' })
  messages: MessageEntity[];
}
