import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ApplicationsService {
  constructor(private supabase: SupabaseService) {}

  async create(applicationData: any) {
    const { data, error } = await this.supabase
      .client
      .from('applications')
      .insert({
        ...applicationData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }

    return {
      success: true,
      message: 'Application submitted successfully',
      data,
    };
  }

  async findAll(filters?: { type?: string; status?: string }) {
    let query = this.supabase
      .client
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return {
      success: true,
      count: data?.length || 0,
      data: data || [],
    };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .client
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return {
      success: true,
      data,
    };
  }

  async updateStatus(
    id: string,
    updateData: { status: string; notes?: string; rejectionReason?: string }
  ) {
    const updatePayload: any = {
      status: updateData.status,
      updated_at: new Date().toISOString(),
    };

    if (updateData.notes) {
      updatePayload.notes = updateData.notes;
    }

    if (updateData.rejectionReason) {
      updatePayload.rejection_reason = updateData.rejectionReason;
    }

    // Add reviewed_at timestamp
    updatePayload.reviewed_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .client
      .from('applications')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    return {
      success: true,
      message: `Application status updated to ${updateData.status}`,
      data,
    };
  }

  async verifyDocuments(
    id: string,
    verifyData: { verified: boolean; notes?: string }
  ) {
    const updatePayload: any = {
      documents_verified: verifyData.verified,
      updated_at: new Date().toISOString(),
    };

    if (verifyData.notes) {
      updatePayload.verification_notes = verifyData.notes;
    }

    const { data, error } = await this.supabase
      .client
      .from('applications')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to verify documents: ${error.message}`);
    }

    return {
      success: true,
      message: verifyData.verified
        ? 'Documents verified successfully'
        : 'Documents marked as unverified',
      data,
    };
  }

  async convertToActive(id: string) {
    // Get the application
    const { data: application, error: fetchError } = await this.supabase
      .client
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Update application status
    const { data: updatedApp, error: updateError } = await this.supabase
      .client
      .from('applications')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to convert application: ${updateError.message}`);
    }

    // Create vendor or rider based on type
    if (application.type === 'VENDOR') {
      await this.createVendorFromApplication(application);
    } else if (application.type === 'DELIVERY_PARTNER') {
      await this.createRiderFromApplication(application);
    }

    return {
      success: true,
      message: `Application converted to active ${application.type.toLowerCase()}`,
      data: updatedApp,
    };
  }

  private async createVendorFromApplication(application: any) {
    const { error } = await this.supabase
      .client
      .from('vendors')
      .insert({
        shop_name: application.shopName || application.business_name,
        owner_name: application.ownerName || application.owner_name,
        email: application.email,
        phone: application.phone,
        address: application.address || application.location,
        city: application.city,
        category: application.category || 'multi',
        fssai_number: application.fssai || application.fssai_number,
        gst_number: application.gst_number,
        is_active: true,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to create vendor:', error);
    }
  }

  private async createRiderFromApplication(application: any) {
    const { error } = await this.supabase
      .client
      .from('riders')
      .insert({
        full_name: application.name || application.full_name,
        email: application.email,
        phone: application.phone,
        city: application.city,
        vehicle_type: application.vehicleType || application.vehicle_type,
        license_number: application.licenseNumber || application.license_number,
        is_active: true,
        status: 'online',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to create rider:', error);
    }
  }

  async getStats() {
    const supabase = this.supabase.client;

    const [
      { data: total },
      { data: pending },
      { data: approved },
      { data: rejected },
      { data: vendors },
      { data: partners },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('type', 'VENDOR'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('type', 'DELIVERY_PARTNER'),
    ]);

    return {
      success: true,
      stats: {
        total: total?.length || 0,
        pending: pending?.length || 0,
        approved: approved?.length || 0,
        rejected: rejected?.length || 0,
        vendors: vendors?.length || 0,
        partners: partners?.length || 0,
      },
    };
  }
}
