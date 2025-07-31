import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entitiy';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private postRepository: Repository<Post>,
    ) {}

    async create(createDto: CreateCommentDto, user: User): Promise<Comment> {
        const post = await this.postRepository.findOneBy({ id: createDto.postId });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = this.commentRepository.create({
            ...createDto,
            user,
            post,
        });

        return this.commentRepository.save(comment);
    }

    async update(commentId: number, updateDto: CreateCommentDto, user: User): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.user.id !== user.id) {
            throw new ForbiddenException('Not Authorized');
        }

        Object.assign(comment, updateDto);
        return this.commentRepository.save(comment);
    }

    async delete(commentId: number, user: User): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.user.id !== user.id) {
            throw new ForbiddenException('Not Authorized');
        }
        await this.commentRepository.remove(comment);
    }

    async findByPost(postId: number): Promise<Comment[]> {
        const comments = await this.commentRepository.find({
            where: { post: { id: postId } },
            order: { created_at: 'ASC' },
        });

        if (!comments || comments.length === 0) {
            throw new NotFoundException('Post not found');
        }

        return comments;
    }
}
