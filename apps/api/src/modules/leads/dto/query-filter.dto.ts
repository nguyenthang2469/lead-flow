import { LeadStatus, Platform } from '@/generated/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryFilterDto {
  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên khách hàng hoặc tin nhắn',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ enum: Platform })
  @IsEnum(Platform)
  @IsOptional()
  platform?: Platform;

  @ApiPropertyOptional({ description: 'Lọc theo ID nhân viên được gán' })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
