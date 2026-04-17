import { Controller, Post, UseInterceptors, UploadedFile, Delete, Param, UseGuards, Body, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private supabaseService: SupabaseService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket: string = 'uploads',
    @Body('path') path: string = `${Date.now()}-file`,
  ) {
    const fullPath = `${path}-${file.originalname}`;
    const url = await this.supabaseService.uploadFile(bucket, fullPath, file);
    return {
      url,
      path: fullPath,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('url')
  async getPublicUrl(
    @Query('bucket') bucket: string = 'uploads',
    @Query('path') path: string,
  ) {
    const client = this.supabaseService.client;
    if (!client) return { error: 'Supabase not configured' };
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteFile(
    @Query('bucket') bucket: string = 'uploads',
    @Query('path') path: string,
  ) {
    const client = this.supabaseService.client;
    if (!client) return { error: 'Supabase not configured' };
    await client.storage.from(bucket).remove([path]);
    return { success: true, path };
  }
}
