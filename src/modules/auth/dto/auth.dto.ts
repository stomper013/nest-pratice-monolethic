import { User } from '@core/database';
import { ILoginPayload } from '@core/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto implements User {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginDto implements ILoginPayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
