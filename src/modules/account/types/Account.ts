/** 用户信息 */
export interface GetAccount {
  avatar: string
  email: string
  nickname: string
  phone: string
}

/** 登录响应 */
export interface LoginAccountResponse {
  data: {
    access_token: string
    refresh_token: string
    userInfo: GetAccount
  }
}

/** 注册响应 */
export interface RegisterAccountResponse {
  data: {
    email: string
    nickname: string
  }
}

/** 登录表单数据 */
export interface LoginFormData {
  email: string
  img_verification_code: string
  password: string
}

/** 注册表单数据 */
export interface RegisterFormData {
  email: string
  email_verification_code: string
  img_verification_code: string
  nickname: string
  password: string
  phone?: string
}
