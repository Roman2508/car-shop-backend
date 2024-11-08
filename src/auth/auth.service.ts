import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async issueAccessToken(id: number): Promise<any> {
    return await this.jwtService.signAsync({ id }, { expiresIn: '30d' });
  }

  async validateUser(dto: LoginDto): Promise<any> {
    let user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Логін або пароль не вірний');
    }

    const isPasswordsTheSame = await compare(dto.password, user?.password);

    if (!isPasswordsTheSame) {
      throw new UnauthorizedException('Логін або пароль не вірний');
    }

    const { password: _, ...restult } = user;

    return restult;
  }

  decodeToken(token: string): { id: number; role: any } {
    const { id, userRole } = this.jwtService.decode(token);

    return { id, role: userRole };
  }

  async login(dto: LoginDto): Promise<any> {
    const user = await this.validateUser(dto);

    const { password, ...restult } = user;

    return {
      user: { ...restult },
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async register(dto: CreateUserDto): Promise<any> {
    let oldUser = await this.userService.findByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException('Такий email вже зареєстрований');
    }

    let newUser = await this.userService.create(dto);

    return {
      user: newUser,
      accessToken: await this.issueAccessToken(newUser.id),
    };
  }

  async getMe(token: string) {
    const { id } = this.decodeToken(token);

    if (id) {
      const userData = await this.userService.findById(id);
      const { password, ...rest } = userData;
      return rest;
    }

    return null;
  }
}
