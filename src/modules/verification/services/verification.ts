import { BaseService, HttpResponse, HttpError } from '@/shared/lib/api'

/**
 * 验证服务
 */
export class VerificationService extends BaseService {
  constructor() {
    super({
      baseUrl: '/v1/verification',
      useClientApi: true,
      serviceName: 'VerificationService',
      silent: true
    })
  }

  /**
   * 获取图形验证码
   * @param email 用户邮箱
   */
  async fetchImgVerificationCode(email: string): Promise<HttpResponse<{ imgBase64: string }>> {
    this.validateEmail(email)
    return this.get<{ imgBase64: string }>('/sendImgVerificationCode', { email })
  }

  /**
   * 发送邮箱验证码
   * @param email 用户邮箱
   */
  async sendEmailVerificationCode(email: string): Promise<HttpResponse<string>> {
    this.validateEmail(email)
    return this.get<string>('/sendEmailVerificationCode', { email })
  }

  /**
   * 验证邮箱格式
   */
  private validateEmail(email: string): void {
    if (!email?.trim()) throw new Error('请提供有效的邮箱地址')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) throw new Error('邮箱格式不正确')
  }

  /**
   * 重写响应验证方法
   */
  protected validateResponse<T>(response: HttpResponse<T>): HttpResponse<T> {
    response = super.validateResponse(response);

    // 图形验证码特殊处理
    if (
      response.data &&
      typeof response.data === 'object' &&
      'imgBase64' in response.data &&
      !response.data.imgBase64
    ) {
      console.error('验证码接口返回无效数据', response);
      return {
        code: 500,
        msg: '获取验证码失败',
        data: { imgBase64: '' } as unknown as T,
        requestId: response.requestId,
        timeStamp: Date.now()
      };
    }

    return response;
  }

  /**
   * 重写错误处理方法
   */
  protected handleError<T>(error: HttpError): never {
    if (error.code === 404) error.msg = '验证服务不可用，请稍后重试'
    throw error;
  }
}

// 单例实例
export const verificationService = new VerificationService()

// 兼容函数
export const fetchVerificationCode = (email: string) =>
  verificationService.fetchImgVerificationCode(email)

export const sendVerificationCode = (email: string) =>
  verificationService.sendEmailVerificationCode(email)
