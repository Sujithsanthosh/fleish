import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) { }

  @Get()
  async findAll(@Query('lat') lat?: number, @Query('lng') lng?: number) {
    if (lat && lng) {
      return this.vendorsService.findNearest(lat, lng);
    }
    return this.vendorsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return this.vendorsService.findAll();
    return this.vendorsService.search(query);
  }

  @Get('nearby')
  async findNearby(@Query('lat') lat: number, @Query('lng') lng: number, @Query('radius') radius?: number) {
    return this.vendorsService.findNearest(lat, lng);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Get(':id/products')
  async findVendorProducts(@Param('id') id: string) {
    const vendor = await this.vendorsService.findOne(id);
    if (!vendor) {
      return { error: 'Vendor not found', products: [] };
    }
    return { vendor: { id: vendor.id, name: vendor.shopName }, products: vendor.products || [] };
  }

  @Post()
  async create(@Body() vendorData: any) {
    return this.vendorsService.create(vendorData);
  }

  @Patch(':id/availability')
  async updateAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.vendorsService.updateAvailability(id, isAvailable);
  }
}
