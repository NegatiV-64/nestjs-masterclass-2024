export class RegisterResponseDto {
  message: 'User created' = 'User created';
  data: {
    authToken: string;
  };
}
