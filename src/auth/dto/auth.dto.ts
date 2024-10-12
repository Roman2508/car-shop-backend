import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8, { message: 'Мінімальна довжина - 8 символів' })
  @IsString()
  password: string;

  @ApiProperty()
  @MinLength(3, { message: 'Мінімальна довжина - 3 символа' })
  @IsString()
  username: string;
}
