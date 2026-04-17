import { Controller, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body('phone') phone: string, @Body('role') role?: string) {
    return this.authService.login(phone, role);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
    @Body('role') role?: string,
  ) {
    return this.authService.verifyOtp(phone, otp, role);
  }

  @Post('admin/login')
  async adminLogin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.adminLogin(email, password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(email, code, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async changePassword(
    @Request() req: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(req.user.userId, currentPassword, newPassword);
  }
}
