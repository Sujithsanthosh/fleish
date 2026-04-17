import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) return this.customersService.search(search);
    return this.customersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.customersService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.customersService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/ban')
  async toggleBan(@Param('id') id: string, @Body('isBanned') isBanned: boolean) {
    return this.customersService.toggleBan(id, isBanned);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
