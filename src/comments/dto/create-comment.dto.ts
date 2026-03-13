import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Văn bản này cần chỉnh sửa lại phần tiêu đề.', description: 'Nội dung bình luận' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  Content: string;

  @ApiProperty({ example: 1, description: 'ID của văn bản' })
  @IsNotEmpty()
  @IsNumber()
  DocumentId: number;
}
