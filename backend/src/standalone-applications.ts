import { NestFactory } from '@nestjs/core';
import { Module, Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Simple Applications Service using Supabase directly
class ApplicationsService {
  private supabase: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.get<string>('SUPABASE_URL')!;
    const key = config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;
    this.supabase = createClient(url, key);
  }

  async create(data: any) {
    const { data: result, error } = await this.supabase
      .from('applications')
      .insert({
        ...data,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { success: true, data: result };
  }

  async findAll(filters?: { type?: string; status?: string }) {
    let query = this.supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return { success: true, count: data?.length || 0, data: data || [] };
  }

  async getStats() {
    const { count: total } = await this.supabase.from('applications').select('*', { count: 'exact', head: true });
    const { count: pending } = await this.supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: approved } = await this.supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved');
    const { count: vendors } = await this.supabase.from('applications').select('*', { count: 'exact', head: true }).eq('type', 'VENDOR');
    const { count: partners } = await this.supabase.from('applications').select('*', { count: 'exact', head: true }).eq('type', 'DELIVERY_PARTNER');

    return {
      success: true,
      stats: { total: total || 0, pending: pending || 0, approved: approved || 0, vendors: vendors || 0, partners: partners || 0 }
    };
  }
}

// Applications Controller
@Controller('api/applications')
class ApplicationsController {
  private service: ApplicationsService;

  constructor(private config: ConfigService) {
    this.service = new ApplicationsService(config);
  }

  @Post()
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.service.getStats();
  }
}

// Minimal Module
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ApplicationsController],
})
class StandaloneApplicationsModule {}

// Bootstrap
async function bootstrap() {
  const app = await NestFactory.create(StandaloneApplicationsModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Applications API running on: http://localhost:${port}/api/applications`);
}

bootstrap();
