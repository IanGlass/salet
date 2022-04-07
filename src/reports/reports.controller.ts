import { Controller, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDTO } from './dtos/create-report.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('/reports')
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDTO) {
    return this.reportsService.create(body);
  }
}
