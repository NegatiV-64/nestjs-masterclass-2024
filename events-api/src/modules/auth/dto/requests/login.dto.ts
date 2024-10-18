import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;
}
