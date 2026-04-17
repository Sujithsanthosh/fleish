import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) { }

  async findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<Vendor | null> {
    return this.vendorsRepository.findOne({ where: { id }, relations: ['products'] });
  }

  async create(vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.vendorsRepository.create(vendorData);
    return this.vendorsRepository.save(vendor);
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    return this.vendorsRepository.update(id, { isAvailable });
  }

  async findNearest(lat: number, lng: number): Promise<Vendor[]> {
    // Basic coordinate filter for now.
    // In production, use PostGIS for spatial queries.
    return this.vendorsRepository.find({
      where: { isAvailable: true },
      order: { rating: 'DESC' },
    });
  }

  async search(query: string): Promise<Vendor[]> {
    return this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('LOWER(vendor.shopName) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(vendor.address) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();
  }
}
