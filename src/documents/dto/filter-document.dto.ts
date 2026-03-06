import { IsOptional, IsString, IsEnum, IsInt, IsPositive, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';
import { DocumentStatus } from '../enums/document-status.enum';

export class FilterDocumentDto extends PaginationDto {
    @IsOptional()
    @IsString()
    keyword?: string; // Tìm kiếm theo Title hoặc DocumentCode

    @IsOptional()
    @IsEnum(DocumentStatus, { message: 'Status không hợp lệ' })
    status?: DocumentStatus;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    createdBy?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    assignedTo?: number;

    @IsOptional()
    @IsDateString({}, { message: 'fromDate phải là chuỗi ngày hợp lệ (ISO 8601)' })
    fromDate?: string;

    @IsOptional()
    @IsDateString({}, { message: 'toDate phải là chuỗi ngày hợp lệ (ISO 8601)' })
    toDate?: string;
}
