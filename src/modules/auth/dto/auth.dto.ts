import { ILoginPayload, IRegisterPayload } from '@core/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto implements IRegisterPayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(6)
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

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
