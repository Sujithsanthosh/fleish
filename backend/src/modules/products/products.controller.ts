import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('search') search?: string) {
    if (search) return this.productsService.search(search);
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.findByVendorId(vendorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.productsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
