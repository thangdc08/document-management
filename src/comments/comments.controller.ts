import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo bình luận mới cho văn bản' })
  create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req.user.Id, createCommentDto);
  }

  @Get('document/:documentId')
  @ApiOperation({ summary: 'Lấy danh sách bình luận của một văn bản (có phân trang)' })
  findByDocument(
    @Param('documentId') documentId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.commentsService.findByDocument(+documentId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bình luận' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật nội dung bình luận' })
  update(@Req() req: any, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bình luận' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.commentsService.remove(+id, req.user);
  }
}
