import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { DialogEntity } from './entities/dialog.entity';
import { CreateDialogDto } from './dto/create-dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(DialogEntity)
    private repository: Repository<DialogEntity>,
  ) {}

  create(dto: CreateDialogDto) {
    // Треба перевіряти чи такого діалогу ще немає
    const members = dto.members.map((el) => ({ id: Number(el) }));
    const dialog = this.repository.create({ members, advertisement: { id: dto.advertisement } });
    return this.repository.save(dialog);
  }

  async findById(id: number) {
    const userAds = await this.repository.find({
      where: { members: { id } },
      select: { id: true },
    });

    const allAds = await Promise.all(
      userAds.map(async (el) => {
        return await this.repository.findOne({
          where: { id: el.id },
          relations: { members: true, advertisement: { photos: true } },
          select: {
            members: { id: true, username: true, avatarUrl: true },
            advertisement: {
              id: true,
              title: true,
              status: true,
              photos: { id: true, filename: true },
              createdAt: true,
            },
          },
        });
      }),
    );

    return allAds;
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Діалог не знайдено');
    }

    return id;
  }
}
