import { IsOptional, IsString, IsEnum, IsInt, IsPositive, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';
import { DocumentStatus } from '../enums/document-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDocumentDto extends PaginationDto {
    @ApiPropertyOptional({ example: 'Báo cáo', description: 'Tìm kiếm theo Tiêu đề hoặc Mã số' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ enum: DocumentStatus, description: 'Lọc theo trạng thái' })
    @IsOptional()
    @IsEnum(DocumentStatus, { message: 'Status không hợp lệ' })
    status?: DocumentStatus;

    @ApiPropertyOptional({ example: 1, description: 'Lọc theo người tạo' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    createdBy?: number;

    @ApiPropertyOptional({ example: 2, description: 'Lọc theo người được giao' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    assignedTo?: number;

    @ApiPropertyOptional({ example: '2024-01-01', description: 'Từ ngày (ISO 8601)' })
    @IsOptional()
    @IsDateString({}, { message: 'fromDate phải là chuỗi ngày hợp lệ (ISO 8601)' })
    fromDate?: string;

    @ApiPropertyOptional({ example: '2024-12-31', description: 'Đến ngày (ISO 8601)' })
    @IsOptional()
    @IsDateString({}, { message: 'toDate phải là chuỗi ngày hợp lệ (ISO 8601)' })
    toDate?: string;
}
