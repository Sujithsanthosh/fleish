import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RidersService } from './riders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('riders')
export class RidersController {
  constructor(private ridersService: RidersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) return this.ridersService.search(search);
    return this.ridersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ridersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.ridersService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ridersService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/online')
  async toggleOnline(@Param('id') id: string, @Body('isOnline') isOnline: boolean) {
    return this.ridersService.toggleOnline(id, isOnline);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ridersService.remove(id);
  }
}
