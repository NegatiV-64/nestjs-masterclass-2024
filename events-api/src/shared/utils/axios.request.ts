import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export async function axiosRequest<T>(axios: AxiosInstance, config: AxiosRequestConfig): Promise<AxiosResponse<T> | Error> {
  try {
    return await axios.request(config);
  } catch (error) {
    return error;
  }
}
