import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDTO } from './dtos/create-report.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/approve/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.approveReport(id, body.approved);
  }
}
