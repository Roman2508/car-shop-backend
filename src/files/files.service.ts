const fs = require('fs');
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FileEntity } from './entities/file.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // async create(file: Express.Multer.File, headers: any, adId: number) {
  async create(file: Express.Multer.File, headers: any) {
    const token = headers.authorization.replace('Bearer ', '');
    const userData = this.authService.decodeToken(token);

    const item = await this.repository.save({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      // ad: { id: adId },
      user: { id: userData.id },
    });

    return this.repository.findOne({
      where: { id: item.id },
      select: {
        id: true,
        originalName: true,
        createdAt: true,
        filename: true,
        mimetype: true,
        size: true,
      },
    });
  }

  async uploadAvatar(file: Express.Multer.File, headers: any) {
    const token = headers.authorization.replace('Bearer ', '');
    const userData = this.authService.decodeToken(token);
    this.userService.updateAvatar(userData.id, file.filename);
    return { ...userData, avatarUrl: file.filename };
  }

  // findAll(adId: number) {
  //   return this.repository.findOneBy({ ad: { id: adId } });
  // }

  async remove(filename: string, id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Файл не знайдено');
    }

    await fs.promises.unlink(`uploads/${filename}`);

    return { id, filename };
  }
}
