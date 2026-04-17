import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: UserRole.CUSTOMER },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id, role: UserRole.CUSTOMER } });
    if (!user) throw new NotFoundException('Customer not found');
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const customer = this.usersRepository.create({ ...data, role: UserRole.CUSTOMER });
    return this.usersRepository.save(customer);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Customer not found');
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Customer not found');
  }

  async toggleBan(id: string, isBanned: boolean): Promise<User> {
    return this.update(id, { isActive: !isBanned });
  }

  async search(query: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .andWhere(
        '(LOWER(user.phone) LIKE LOWER(:query) OR LOWER(user.fullName) LIKE LOWER(:query))',
        { query: `%${query}%` },
      )
      .getMany();
  }
}
