import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.services';
import { User, Prisma } from '@prisma/client';
import { PasswordService } from './services/password.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existing) {
      throw new ConflictException('email already exists');
    }
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    data.password = hashedPassword;
    return this.prisma.user.create({
      data,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isMatchedPassword = await this.passwordService.validatePassword(
      password,
      user.password,
    );
    if (!isMatchedPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async generateAuthTokenFromLogin(payload: {
    userId: number;
    email?: string;
  }) {
    const accessTokenExpiresIn = process.env.JWT_EXPIRE_TIME;

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn,
      }),
    };
  }
}
