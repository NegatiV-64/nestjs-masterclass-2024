import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MatchField } from 'src/shared/validators/match-field.validator';

export class RegisterDto {
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

  @ApiProperty({
    example: "password123"
  })
  @IsString()
  @MinLength(6)
  @MaxLength(22)
  @MatchField('password')
  passwordConfirmation: string;
}
