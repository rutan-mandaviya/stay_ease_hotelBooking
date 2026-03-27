import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import {
  ApiAuth,
  ApiRegister,
  ApiLogin,
  ApiRefresh,
  ApiGetMe,
} from './auth.swagger';

@ApiAuth('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiRegister()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiRefresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @ApiGetMe()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: { user: JwtPayloadDto }) {
    return this.authService.getMe(req.user.id);
  }
}
