import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: "test@test.com"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123"
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;
}
