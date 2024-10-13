export class LoginResponseDto {
  message: 'User logged in' = 'User logged in';
  data: {
    authToken: string;
  };
}
