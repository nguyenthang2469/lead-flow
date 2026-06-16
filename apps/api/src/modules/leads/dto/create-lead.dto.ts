import { Platform } from '@/generated/prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value as string).trim())
  customerName!: string;

  @ApiProperty({ example: 'Tôi muốn tư vấn về gói dịch vụ marketing.' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value as string).trim())
  message!: string;

  @ApiPropertyOptional({ enum: Platform, default: Platform.MESSENGER })
  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;
}
