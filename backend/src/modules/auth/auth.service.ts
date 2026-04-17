import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../../entities/user.entity';
import * as crypto from 'crypto';

// Simple in-memory reset code store (use Redis/DB in production)
const resetCodes = new Map<string, { code: string; expires: Date }>();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(phone: string, role?: string) {
    // In a real app, send OTP via SMS here (Twilio/MSG91).
    return { message: 'OTP sent to ' + phone };
  }

  async adminLogin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPPORT) {
      throw new UnauthorizedException('Not authorized');
    }
    // In production: use bcrypt.compare(password, user.hashedPassword)
    if (user.hashedPassword) {
      const bcrypt = require('bcrypt');
      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) throw new UnauthorizedException('Invalid password');
    } else if (password.length < 4) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role, userId: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.fullName || email.split('@')[0],
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyOtp(phone: string, otp: string, role?: string) {
    // In production: verify against SMS provider OTP
    if (otp !== '1234') {
      throw new UnauthorizedException('Invalid OTP');
    }

    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      const userRole = this.parseRole(role);
      user = await this.usersService.create({ phone, role: userRole });
    } else {
      if (role) {
        const userRole = this.parseRole(role);
        await this.usersService.updateRole(user.id, userRole);
        user.role = userRole;
      }
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role, userId: user.id };
    const token = this.jwtService.sign(payload);

    const userResponse = {
      id: user.id,
      phone: user.phone,
      name: user.fullName || user.phone,
      email: user.email || '',
      role: user.role,
      fullName: user.fullName,
      avatar: user.fullName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=059669&color=fff` : null,
    };

    return {
      token,
      access_token: token,
      user: userResponse,
      vendor: userResponse,
      rider: userResponse,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset code has been sent' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    resetCodes.set(email, { code, expires });

    // In production: send email via SMTP
    // await this.emailService.sendResetCode(email, code);
    console.log(`[DEV] Reset code for ${email}: ${code}`);

    return { message: 'Reset code sent to your email' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const stored = resetCodes.get(email);
    if (!stored || stored.code !== code || stored.expires < new Date()) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { hashedPassword });

    resetCodes.delete(email);
    return { message: 'Password reset successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // In production: verify current password with bcrypt
    const bcrypt = require('bcrypt');
    if (user.hashedPassword) {
      const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!valid) throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { hashedPassword });
    return { message: 'Password changed successfully' };
  }

  private parseRole(role?: string): UserRole {
    const normalized = role?.toUpperCase();
    switch (normalized) {
      case 'VENDOR': return UserRole.VENDOR;
      case 'RIDER': return UserRole.RIDER;
      case 'ADMIN': return UserRole.ADMIN;
      case 'HR': return UserRole.HR;
      case 'CA': return UserRole.CA;
      case 'SUPPORT': return UserRole.SUPPORT;
      default: return UserRole.CUSTOMER;
    }
  }
}
