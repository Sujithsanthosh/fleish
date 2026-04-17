import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      return { error: 'User not found' };
    }
    return {
      id: user.id,
      name: user.fullName || user.phone,
      phone: user.phone,
      email: user.email || '',
      role: user.role,
      fullName: user.fullName,
      avatar: user.fullName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=059669&color=fff` : null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() data: any) {
    const updated = await this.usersService.updateProfile(req.user.userId, {
      fullName: data.name || data.fullName,
      email: data.email,
    });
    if (!updated) {
      return { error: 'Failed to update profile' };
    }
    return {
      id: updated.id,
      name: updated.fullName || updated.phone,
      phone: updated.phone,
      email: updated.email || '',
      role: updated.role,
    };
  }
}
