import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['vendor'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['vendor'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByVendorId(vendorId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .where('LOWER(product.name) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(product.category) LIKE LOWER(:q)', { q: `%${query}%` })
      .getMany();
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(data);
    return this.productsRepository.save(product);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
  }
}
