import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private repository: Repository<MessageEntity>,
  ) {}
  async createMessage(dto: CreateMessageDto): Promise<MessageEntity> {
    const message = this.repository.create({
      sender: { id: dto.sender },
      dialog: { id: dto.dialog },
      text: dto.text,
    });

    await this.repository.save(message);

    return this.repository.findOne({
      where: { id: message.id },
      relations: { sender: true, dialog: true },
      select: {
        sender: { id: true, username: true, avatarUrl: true },
        dialog: { id: true },
      },
    });
  }

  async updateIsReading(id: number): Promise<MessageEntity> {
    const message = await this.repository.findOne({ where: { id } });

    if (!message) new NotFoundException('Повідомлення не знайдено');

    return this.repository.save({ ...message, isReaded: true });
  }

  // find messages by dialog id
  async getMessages(id: number): Promise<MessageEntity[]> {
    return this.repository.find({
      where: { dialog: { id } },
      relations: { sender: true, dialog: true },
      select: {
        sender: { id: true, username: true, avatarUrl: true  },
        dialog: { id: true },
        sendAt: true,
        text: true,
        id: true,
      },
      order: { sendAt: 'ASC' },
    });
  }

  async removeMessage(id: number): Promise<number> {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Повідомлення не знайдено');
    }

    return id;
  }
}
