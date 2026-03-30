import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../users/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { buildResponse } from 'src/common/helpers/response.helper';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<ReturnType<typeof buildResponse>> {
    if (dto.role === UserRole.ADMIN) {
      throw new ForbiddenException(
        'Admin accounts cannot be created via public registration.',
      );
    }
    const existing = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const assignedRole =
      dto.role === UserRole.HOTEL_OWNER ? UserRole.HOTEL_OWNER : UserRole.GUEST;

    const saltRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password_hash: hash,
      role: assignedRole,
      phone: dto.phone,
    });

    const { id, name, email, role, phone } = user;
    const newUser = { id, name, email, role, phone };

    return buildResponse(
      HttpStatus.CREATED,
      'User registered successfully',
      newUser,
    );
  }

  async login(dto: LoginDto): Promise<ReturnType<typeof buildResponse>> {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password_hash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.signTokens(user);
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<ReturnType<typeof buildResponse>> {
    try {
      const payload = this.jwtService.verify<JwtPayloadDto>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userModel.findByPk(payload.id);
      if (!user) throw new UnauthorizedException();

      return this.signTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(id: string) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) throw new UnauthorizedException('User not found');
    return buildResponse(
      HttpStatus.OK,
      'User profile retrieved successfully',
      user,
    );
  }
  private signTokens(user: User) {
    const payload: JwtPayloadDto = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '2d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return buildResponse(HttpStatus.OK, 'Login successful', {
      access_token,
      refresh_token,
    });
  }
}
