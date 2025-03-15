/** 统一响应类型 */
export interface HttpResponse<T = null> {
  data: T;
  code?: number;
  msg?: string;
  requestId: string;
  timeStamp: number;
}