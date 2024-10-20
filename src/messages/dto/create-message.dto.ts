import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  sender: number;

  @ApiProperty()
  dialog: number;
}
