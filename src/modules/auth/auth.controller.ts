import { IJwtResponse } from '@core/interfaces';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<IJwtResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<IJwtResponse> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<IJwtResponse> {
    const { refreshToken } = body;

    return this.authService.validRefreshToken(refreshToken);
  }
}
