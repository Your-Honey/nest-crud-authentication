import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.services';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async findAll(userId: number) {
    return this.prisma.post.findMany({ where: { userId } });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.findOne(id);
    if (post?.userId !== userId) {
      throw new NotAcceptableException('you cant update others post');
    }
    const updatedPost = await this.prisma.post.update({
      where: {
        id,
      },
      data: updatePostDto,
    });
    return updatedPost;
  }

  async remove(id: string, userId: number): Promise<Post> {
    const post = await this.findOne(id);
    if (post?.userId !== userId) {
      throw new NotAcceptableException('you cant delete others post');
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
