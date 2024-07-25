import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginDto, RegisterDto } from './dto';
import { IJwtResponse } from '@core/interfaces';

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
}
