import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmploymentStatus } from '../../entities/employee.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Employee> {
    const emp = await this.employeesRepository.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const emp = this.employeesRepository.create(data);
    return this.employeesRepository.save(emp);
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    await this.employeesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Employee not found');
  }

  async getStats(): Promise<any> {
    const all = await this.employeesRepository.find();
    return {
      total: all.length,
      active: all.filter(e => e.status === EmploymentStatus.ACTIVE).length,
      onLeave: all.filter(e => e.status === EmploymentStatus.ON_LEAVE).length,
      probation: all.filter(e => e.status === EmploymentStatus.PROBATION).length,
      totalPayroll: all.reduce((sum, e) => sum + Number(e.salary || 0), 0),
      byDepartment: all.reduce((acc, e) => {
        const dept = e.department || 'Unassigned';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {}),
    };
  }
}
