import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user, must be between 6 and 22 characters long',
    example: 'password123',
    minLength: 6,
    maxLength: 22,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;
}
