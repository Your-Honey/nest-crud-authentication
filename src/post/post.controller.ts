import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: number }; // Assuming user has an id property
}

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() postData: CreatePostDto, @Req() req: AuthenticatedRequest) {
    const { title, content } = postData;
    const { userId } = req.user;
    return this.postService.create({
      title,
      content,
      author: {
        connect: { id: userId },
      },
    });
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    return this.postService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { userId } = req.user;
    return this.postService.update(id, updatePostDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    return this.postService.remove(id, userId);
  }
}
