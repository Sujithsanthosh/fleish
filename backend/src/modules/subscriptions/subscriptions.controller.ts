import { Controller, Get, Post, Body, Request, UseGuards, Param, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscribeDto, CancelSubscriptionDto } from './dto/subscribe.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  // GET /subscriptions/plans — public
  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getAllPlans();
  }

  // GET /subscriptions/plans/:id — public
  @Get('plans/:id')
  async getPlanById(@Param('id') id: string) {
    return this.subscriptionsService.getPlanById(id);
  }

  // POST /subscriptions/subscribe — create Razorpay order or activate free plan
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto, @Request() req: any) {
    return this.subscriptionsService.createSubscriptionOrder(dto.planId, req.user.userId);
  }

  // POST /subscriptions/confirm — confirm payment and activate subscription
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmSubscription(@Body() dto: SubscribeDto, @Request() req: any) {
    return this.subscriptionsService.confirmSubscription(req.user.userId, dto);
  }

  // GET /subscriptions/user — get current user's subscription
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserSubscription(@Request() req: any) {
    return this.subscriptionsService.getUserSubscription(req.user.userId);
  }

  // POST /subscriptions/cancel — cancel subscription
  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancelSubscription(@Body() dto: CancelSubscriptionDto, @Request() req: any) {
    return this.subscriptionsService.cancelSubscription(req.user.userId, dto);
  }

  // GET /subscriptions/checkout-benefits — calculate checkout discounts
  @UseGuards(JwtAuthGuard)
  @Get('checkout-benefits')
  async getCheckoutBenefits(
    @Request() req: any,
    @Query('orderAmount') orderAmount: string,
    @Query('deliveryFee') deliveryFee: string,
  ) {
    return this.subscriptionsService.calculateCheckoutBenefits(
      req.user.userId,
      parseFloat(orderAmount) || 0,
      parseFloat(deliveryFee) || 40,
    );
  }

  // POST /subscriptions/seed — dev-only endpoint to seed plans
  @Post('seed')
  async seedPlans() {
    return this.subscriptionsService.seedPlans();
  }
}
