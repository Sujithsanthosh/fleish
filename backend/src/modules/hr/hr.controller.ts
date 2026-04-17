import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EmploymentStatus } from '../../entities/employee.entity';

@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @UseGuards(JwtAuthGuard)
  @Get('employees')
  async findAllEmployees() {
    return this.hrService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('employees/stats')
  async getEmployeeStats() {
    return this.hrService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('employees/:id')
  async findEmployee(@Param('id') id: string) {
    return this.hrService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('employees')
  async createEmployee(@Body() data: any) {
    return this.hrService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('employees/:id')
  async updateEmployee(@Param('id') id: string, @Body() data: any) {
    return this.hrService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('employees/:id/status')
  async updateEmployeeStatus(@Param('id') id: string, @Body('status') status: EmploymentStatus) {
    return this.hrService.update(id, { status });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('employees/:id')
  async removeEmployee(@Param('id') id: string) {
    return this.hrService.remove(id);
  }

  // Payroll endpoint
  @UseGuards(JwtAuthGuard)
  @Get('payroll')
  async getPayroll(@Query('month') month?: string) {
    const employees = await this.hrService.findAll();
    const active = employees.filter(e => e.status === EmploymentStatus.ACTIVE);
    return {
      total: active.reduce((sum, e) => sum + Number(e.salary || 0), 0),
      count: active.length,
      employees: active.map(e => ({
        id: e.id,
        name: e.fullName,
        department: e.department,
        salary: Number(e.salary || 0),
      })),
      month: month || new Date().toISOString().slice(0, 7),
    };
  }

  // Attendance endpoint
  @UseGuards(JwtAuthGuard)
  @Get('attendance')
  async getAttendance(@Query('date') date?: string) {
    return {
      date: date || new Date().toISOString().slice(0, 10),
      records: [], // Will be populated when attendance module is fully implemented
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance/clock-in')
  async clockIn(@Body() data: any) {
    return { success: true, clockIn: new Date() };
  }

  @UseGuards(JwtAuthGuard)
  @Post('attendance/clock-out')
  async clockOut(@Body() data: any) {
    return { success: true, clockOut: new Date() };
  }

  // Leave management
  @UseGuards(JwtAuthGuard)
  @Get('leaves')
  async getLeaves(@Query('employeeId') employeeId?: string) {
    return []; // Will be populated when leave module is implemented
  }

  @UseGuards(JwtAuthGuard)
  @Post('leaves')
  async requestLeave(@Body() data: any) {
    return { id: `LEAVE-${Date.now()}`, ...data, status: 'pending' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('leaves/:id/status')
  async updateLeaveStatus(@Param('id') id: string, @Body('status') status: string) {
    return { id, status };
  }

  // Performance
  @UseGuards(JwtAuthGuard)
  @Get('performance')
  async getPerformance(@Query('employeeId') employeeId?: string) {
    return []; // Will be populated when performance module is implemented
  }

  @UseGuards(JwtAuthGuard)
  @Post('performance')
  async addReview(@Body() data: any) {
    return { id: `PERF-${Date.now()}`, ...data };
  }

  // Recruitment
  @UseGuards(JwtAuthGuard)
  @Get('recruitment/jobs')
  async getJobs() {
    return []; // Will use JobApplication entity when controller is built
  }

  @UseGuards(JwtAuthGuard)
  @Post('recruitment/jobs')
  async createJob(@Body() data: any) {
    return { id: `JOB-${Date.now()}`, ...data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('recruitment/applications')
  async getApplications(@Query('jobId') jobId?: string) {
    return []; // Will use JobApplication entity
  }

  // Expenses
  @UseGuards(JwtAuthGuard)
  @Get('expenses')
  async getExpenses(@Query('employeeId') employeeId?: string) {
    return []; // Will be populated when expense module is implemented
  }

  @UseGuards(JwtAuthGuard)
  @Post('expenses')
  async submitExpense(@Body() data: any) {
    return { id: `EXP-${Date.now()}`, ...data, status: 'pending' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('expenses/:id/status')
  async updateExpenseStatus(@Param('id') id: string, @Body('status') status: string) {
    return { id, status };
  }

  // Notifications/Broadcasts
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotifications() {
    return []; // Will be populated when notifications module is wired
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications')
  async sendNotification(@Body() data: any) {
    return { id: `NOTIF-${Date.now()}`, ...data, sentAt: new Date() };
  }

  // Scheduling
  @UseGuards(JwtAuthGuard)
  @Get('schedule')
  async getSchedule(@Query('employeeId') employeeId?: string, @Query('week') week?: string) {
    return []; // Will be populated when scheduling module is implemented
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async createSchedule(@Body() data: any) {
    return { id: `SCH-${Date.now()}`, ...data };
  }
}
