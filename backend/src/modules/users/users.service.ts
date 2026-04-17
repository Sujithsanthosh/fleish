import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await this.usersRepository.update(userId, { role });
  }

  async updateFcmToken(userId: string, token: string) {
    return this.usersRepository.update(userId, { fcmToken: token });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    await this.usersRepository.update(userId, data);
    return this.findById(userId);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async update(userId: string, data: Partial<User>): Promise<void> {
    await this.usersRepository.update(userId, data);
  }
}
