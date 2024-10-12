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
  findAll(@Param('id') id: string) {
    return this.dialogsService.findAll(+id);
  }

  // @Get('/check-is-exist/:tutorId/:studentId')
  // checkIsExist(@Param('tutorId') tutorId: string, @Param('studentId') studentId: string) {
  //   return this.dialogsService.checkIsExist(+tutorId, +studentId);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dialogsService.remove(+id);
  }
}
