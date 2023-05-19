import { AxiosInstance } from "axios";

export interface BaseAPIResponse<T = undefined> {
  success: boolean;
  data: T;
}

export class BaseAPI {
  protected axios: AxiosInstance;
  protected setError: (error: string) => void;
  protected setSuccess: (error: string) => void;

  constructor(
    axios: AxiosInstance,
    apiMethods: {
      setError: (error: string) => void;
      setSuccess: (error: string) => void;
    }
  ) {
    this.axios = axios;
    this.setError = apiMethods.setError;
    this.setSuccess = apiMethods.setSuccess;
  }
}
