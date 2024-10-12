import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty()
  members: number[];
}
