import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({
    message: 'title is required',
  })
  title: string;
  @IsString()
  @IsNotEmpty({
    message: 'content is required',
  })
  content: string;
}
