import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdvertisementService } from './advertisement.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { GetAdvertisementQueryDto } from './dto/get-advertisement.query.dto';

@Controller('advertisement')
@ApiTags('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateAdvertisementDto) {
    return this.advertisementService.create(dto);
  }

  @Get()
  paginateAndFilter(@Query() query: GetAdvertisementQueryDto) {
    return this.advertisementService.paginateAndFilter(query);
  }

  @Get('get-not-accepted')
  getNotAccepted() {
    return this.advertisementService.getNotAccepted();
  }

  @Get('new')
  getNew() {
    return this.advertisementService.getNew();
  }

  @Get('bestsellers')
  getBestsellers() {
    return this.advertisementService.getBestsellers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisementService.findOne(+id);
  }

  @Get('/search/:title')
  searchByString(@Param('title') title: string) {
    return this.advertisementService.searchByString(title);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my/:id')
  getMy(@Param('id') id: string) {
    return this.advertisementService.getMy(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdvertisementDto) {
    return this.advertisementService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('accept/:id')
  accept(@Param('id') id: string) {
    return this.advertisementService.accept(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisementService.remove(+id);
  }
}
