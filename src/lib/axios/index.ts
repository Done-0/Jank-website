import type { HttpResponse } from '@/types/HttpType';
import { useAuthStore } from "@/store/Auth";

/**
 * 请求配置接口
 */
interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, any> | string[][] | URLSearchParams;
  headers?: Record<string, string>;
  timeout?: number;
  withToken?: boolean;
}

/**
 * 默认请求配置
 * @param baseURL 请求基准 URL
 * @param timeout 请求超时时间
 * @param headers 请求头
 */
const defaultConfig = {
  baseURL: "http://localhost:9010/api",
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 请求拦截器：统一添加请求头、日志、token等
 * @param url 请求 URL
 * @param options 请求配置
 * @returns 处理后的请求配置
 */
const requestInterceptor = (url: string, options: HttpRequestOptions) => {
  const auth = useAuthStore.getState();
  const headers = {
    ...defaultConfig.headers,
    ...options.headers,
    ...(options.withToken && auth.accessToken ? { 'Authorization': `Bearer ${auth.accessToken}` } : {})
  };

  return { url, options: { ...options, headers } };
};

/**
 * 响应拦截器：统一处理响应数据，检查状态码等
 * @param response 响应数据
 * @returns 处理后的响应数据
 */
const responseInterceptor = async <T>(response: Response, options: HttpRequestOptions): Promise<HttpResponse<T>> => {
  if (response.status >= 200 && response.status < 300) {
    const data: HttpResponse<T> = await response.json();
    return Promise.resolve(data);
  } else {
    const errorData: HttpResponse<T> = await response.json();
    if (options.withToken && response.status === 401 && useAuthStore.getState().refreshToken) {
      const retryOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${useAuthStore.getState().refreshToken}`
        }
      };
      const retryResponse = await fetch(response.url, {
        method: options.method,
        headers: new Headers(retryOptions.headers),
        body: options.data ? JSON.stringify(options.data) : undefined,
      });
      return responseInterceptor(retryResponse, options);
    }
    return Promise.reject(errorData);
  }
};

async function request<T = any>(
  api: string,
  options: HttpRequestOptions = {}
): Promise<HttpResponse<T>> {
  const { method = 'GET', data, timeout = defaultConfig.timeout } = options;

  const fullUrl = `${defaultConfig.baseURL}${api}`;

  const { url, options: finalOptions } = requestInterceptor(fullUrl, options);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: new Headers(finalOptions.headers),
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return responseInterceptor(response, finalOptions);
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('请求超时');
    }

    console.error('请求错误', error.message || '服务器错误');
    throw error;
  }
}

/**
 * API 请求实例，封装 GET、POST、PUT、DELETE 请求方法
 */
const http = {
  get: <T = any>(api: string, params?: Record<string, any>, options?: HttpRequestOptions) =>
    request<T>(api, { method: 'GET', params, ...options }),

  post: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { method: 'POST', data, ...options }),

  put: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { method: 'PUT', data, ...options }),

  delete: <T = any>(api: string, data?: any, options?: HttpRequestOptions) =>
    request<T>(api, { method: 'DELETE', data, ...options }),
};

export default http;
