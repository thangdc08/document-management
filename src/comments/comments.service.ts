import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';
import { ResultPaginationDTO } from 'src/common/dto/result-pagination.dto';
import { Document } from 'src/documents/entities/document.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) { }

  async create(userId: number, createCommentDto: CreateCommentDto) {
    // Kiểm tra Document có tồn tại không
    const document = await this.documentRepository.findOne({
      where: { Id: createCommentDto.DocumentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${createCommentDto.DocumentId} not found`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      UserId: userId,
    });
    return await this.commentRepository.save(comment);
  }

  async findByDocument(documentId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const [data, total] = await this.commentRepository.findAndCount({
      where: { DocumentId: documentId },
      relations: ['User'],
      order: { CreatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new ResultPaginationDTO(data, total, page, limit);
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { Id: id },
      relations: ['User'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: any) {
    const comment = await this.findOne(id);
    this.logger.log('user?.RoleCode: ' + user?.RoleCode);
    // Kiểm tra quyền: Phải là chủ comment hoặc Admin
    if (comment.UserId !== user.Id && user?.RoleCode !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bình luận này');
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: number, user: any) {
    const comment = await this.findOne(id);

    // Kiểm tra quyền: Phải là chủ comment hoặc Admin
    if (comment.UserId !== user.Id && user?.RoleCode !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    return await this.commentRepository.remove(comment);
  }
}
