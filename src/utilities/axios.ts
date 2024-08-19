import axios, {
  Method,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";

export const sendData = async <T>(
  url: string,
  method: Method,
  data?: any,
  headers?: AxiosRequestConfig["headers"]
): Promise<AxiosResponse<T> | AxiosError> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers, // Include the headers in the Axios request
    });
    return response;
  } catch (error) {
    return error as AxiosError;
  }
};
