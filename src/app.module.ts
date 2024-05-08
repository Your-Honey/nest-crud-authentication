import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), PostModule],
})
export class AppModule {}
