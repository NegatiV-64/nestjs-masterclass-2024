import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MatchField } from 'src/shared/validators/match-field.validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account, must be between 6 and 22 characters long',
    example: 'password123',
    minLength: 6,
    maxLength: 22,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @ApiProperty({
    description: 'Password confirmation, should match the password field',
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
