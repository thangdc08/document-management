import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Văn bản này cần chỉnh sửa lại phần tiêu đề.', description: 'Nội dung bình luận' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  Content: string;
}   