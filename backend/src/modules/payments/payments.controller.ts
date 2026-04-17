import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '../../entities/payment.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('status') status?: PaymentStatus) {
    if (status) return this.paymentsService.findByStatus(status);
    return this.paymentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.paymentsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.paymentsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: PaymentStatus) {
    return this.paymentsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reconcile')
  async reconcileUTR(@Param('id') id: string, @Body('utr') utr: string) {
    return this.paymentsService.reconcileUTR(id, utr);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/refund')
  async refund(@Param('id') id: string, @Body('reason') reason: string) {
    return this.paymentsService.refund(id, reason);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/dispute')
  async markDisputed(@Param('id') id: string) {
    return this.paymentsService.markDisputed(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/resolve')
  async resolveDispute(@Param('id') id: string) {
    return this.paymentsService.resolveDispute(id);
  }

  // Razorpay webhook endpoint (no auth guard - verified via signature)
  @Post('webhook/razorpay')
  async handleRazorpayWebhook(@Body() payload: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.handleWebhook(payload, signature);
  }
}
