import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MatchField } from 'src/shared/validators/match-field.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The email of user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password should be between 6 and 22 char. long',
    example: 'password123',
    minLength: 6,
    maxLength: 22,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @ApiProperty({
    description: 'password confirm should be same as password',
    example: 'password123',
    minLength: 6,
    maxLength: 22,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  @MatchField('password')
  passwordConfirmation: string;
}
