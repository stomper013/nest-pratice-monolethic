import { UserDecorator } from '@core/common';
import { IJwtPayload } from '@core/interfaces';
import { JwtGuard } from '@core/middlewares';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('error')
  async getError(): Promise<void> {
    return this.userService.getError();
  }

  @Post('update/password')
  async updatePassword(
    @UserDecorator() user: IJwtPayload,
    @Body() body: UpdatePasswordDto,
  ): Promise<boolean> {
    const { userId } = user;
    const { newPassword } = body;
    return this.userService.updatePassword(userId, newPassword);
  }
}
