import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SuccessResDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
