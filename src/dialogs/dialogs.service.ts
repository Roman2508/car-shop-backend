import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DialogEntity } from './entities/dialog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(DialogEntity)
    private repository: Repository<DialogEntity>,
  ) {}

  create(dto: CreateDialogDto) {
    const members = dto.members.map((el) => ({ id: el }));
    const dialog = this.repository.create({ members });
    return this.repository.save(dialog);
  }

  // checkIsExist(tutorId: number, studentId: number) {
  //   return this.repository.findOne({
  //     where: { tutor: { id: tutorId }, student: { id: studentId } },
  //   });
  // }

  findAll(id: number) {
    return this.repository.find({
      where: { members: { id } },
      relations: { members: true },
      select: { members: { id: true, username: true, avatarUrl: true } },
    });
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Діалог не знайдено');
    }

    return id;
  }
}
