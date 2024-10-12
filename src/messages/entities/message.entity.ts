import { Max } from 'class-validator';
import { DialogEntity } from 'src/dialogs/entities/dialog.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Max(300)
  @Column()
  text: string;

  @Column({ default: false })
  isReaded: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender' })
  sender: UserEntity;

  @ManyToOne(() => DialogEntity, (dialog) => dialog.messages, {
    onDelete: 'CASCADE',
  })
  dialog: DialogEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  sendAt: Date;
}
