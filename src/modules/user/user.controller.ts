import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@core/database';
import { UpdatePasswordDto } from './dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update/password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<User> {
    const { newPassword } = body;
    return this.userService.updatePassword(id, newPassword);
  }
}
