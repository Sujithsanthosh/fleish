import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsString()
  @IsOptional()
  paymentId?: string; // Razorpay payment ID

  @IsString()
  @IsOptional()
  razorpayOrderId?: string;

  @IsString()
  @IsOptional()
  razorpaySignature?: string;
}

export class CancelSubscriptionDto {
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CheckoutDiscountDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  orderAmount: number;
  deliveryFee: number;
}
