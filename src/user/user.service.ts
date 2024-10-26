import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserRoles } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto) {
    const salt = await genSalt(10);

    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      throw new BadRequestException('Користувач з такою поштою вже зареєстрований');
    }

    let userPayload: Omit<UserEntity, 'id' | 'dialogs' | 'avatarUrl' | 'createdAt'> = {
      password: await hash(dto.password, salt),
      email: dto.email,
      role: dto.role,
      username: dto.username,
      advertisements: [],
    };

    const newUser = this.repository.create(userPayload);
    return this.repository.save(newUser);
  }

  async update(id: number, dto: UpdateUserDto) {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser && id !== existedUser.id) {
      throw new BadRequestException('Користувач з такою поштою вже зареєстрований');
    }

    let user = await this.repository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Не знайдено');

    const isPasswordsTheSame = await compare(dto.password, user.password);

    let updatedUser = { ...user, ...dto };

    if (!isPasswordsTheSame) {
      const salt = await genSalt(10);
      const newPassword = await hash(dto.password, salt);
      updatedUser = { ...updatedUser, password: newPassword };
    }

    return this.repository.save(updatedUser);
  }

  async updateAvatar(id: number, avatarUrl: string) {
    let user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Не знайдено');
    await this.repository.save({ ...user, avatarUrl });
  }

  async updateRole(dto: UpdateUserRoleDto) {
    const user = await this.repository.findOne({ where: { id: dto.id } });
    if (!user) throw new NotFoundException('Не знайдено');
    return this.repository.save({ ...user, role: dto.newRole });
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Не знайдено');
    }
    return id;
  }
}
