import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@ApiTags('Leads Management')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all leads with advanced filtering and pagination',
  })
  getAllLeads(@Query() filterDto: QueryFilterDto) {
    return this.leadsService.getAllLeads(filterDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get lead detailed information including log activities',
  })
  getLeadById(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Webhook endpoint / Public endpoint to create an incoming lead',
  })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead status or assign to a staff' })
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete lead' })
  delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }
}
