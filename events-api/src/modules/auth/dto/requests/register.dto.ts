import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MatchField } from 'src/shared/validators/match-field.validator';

export class RegisterDto {
  @ApiProperty({ example: 'gordon@freeman.com' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(22)
  @MatchField('password')
  passwordConfirmation: string;
}
