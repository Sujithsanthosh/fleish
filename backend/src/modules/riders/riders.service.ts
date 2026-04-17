import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class RidersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.RIDER },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id, role: UserRole.RIDER } });
    if (!user) throw new NotFoundException('Rider not found');
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const rider = this.usersRepository.create({ ...data, role: UserRole.RIDER });
    return this.usersRepository.save(rider);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Rider not found');
  }

  async toggleOnline(id: string, isOnline: boolean): Promise<User> {
    // Track online status via fcmToken or isActive
    return this.update(id, { isActive: isOnline });
  }

  async search(query: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.RIDER })
      .andWhere(
        '(LOWER(user.phone) LIKE LOWER(:query) OR LOWER(user.fullName) LIKE LOWER(:query))',
        { query: `%${query}%` },
      )
      .getMany();
  }
}
