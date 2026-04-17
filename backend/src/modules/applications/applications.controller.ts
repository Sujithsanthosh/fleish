import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  // POST /api/applications - Create new application (Vendor or Delivery Partner)
  @Post()
  async create(@Body() applicationData: any) {
    return this.applicationsService.create(applicationData);
  }

  // GET /api/applications - Get all applications (Admin only)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('type') type?: string, @Query('status') status?: string) {
    return this.applicationsService.findAll({ type, status });
  }

  // GET /api/applications/stats - Get application statistics
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.applicationsService.getStats();
  }

  // GET /api/applications/:id - Get single application
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  // PATCH /api/applications/:id/status - Update application status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateData: { status: string; notes?: string; rejectionReason?: string }
  ) {
    return this.applicationsService.updateStatus(id, updateData);
  }

  // PATCH /api/applications/:id/verify - Verify application documents
  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify')
  async verifyApplication(
    @Param('id') id: string,
    @Body() verifyData: { verified: boolean; notes?: string }
  ) {
    return this.applicationsService.verifyDocuments(id, verifyData);
  }

  // POST /api/applications/:id/convert - Convert application to active vendor/partner
  @UseGuards(JwtAuthGuard)
  @Post(':id/convert')
  async convertToActive(@Param('id') id: string) {
    return this.applicationsService.convertToActive(id);
  }
}
