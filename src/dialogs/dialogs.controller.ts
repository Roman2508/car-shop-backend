import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';

import { DialogsService } from './dialogs.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateDialogDto } from './dto/create-dialog.dto';

@ApiTags('dialogs')
@Controller('dialogs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Post()
  create(@Body() dto: CreateDialogDto) {
    return this.dialogsService.create(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dialogsService.findById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dialogsService.remove(+id);
  }
}
