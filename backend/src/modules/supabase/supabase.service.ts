import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Using service role key is recommended for backend functions to bypass RLS if needed,
    // or use anon key if you want RLS strictly (along with passing the user token).
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY'); 

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('Supabase URL or Key is missing from configuration.');
    }
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Uploads a file to Supabase Storage and returns the public URL.
   * @param bucket The Supabase Storage bucket name
   * @param path The path/filename to store the file as
   * @param file The Multer file object
   * @returns The public URL of the uploaded file
   */
  async uploadFile(bucket: string, path: string, file: Express.Multer.File): Promise<string> {
    if (!this.supabase) {
      throw new InternalServerErrorException('Supabase client is not configured properly.');
    }

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Overwrite if it already exists
      });

    if (error) {
      throw new InternalServerErrorException(`Supabase upload failed: ${error.message}`);
    }

    const { data: publicData } = this.supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicData.publicUrl;
  }
}
