import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '@/generated/prisma/enums';

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'ID của nhân viên phụ trách lead này' })
  @IsString()
  @IsOptional()
  assignedTo?: string;
}
