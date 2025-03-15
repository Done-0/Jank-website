/** 登录表单数据 */
export interface LoginFormData {
    email: string;
    password: string;
    img_verification_code: string;
}

/** 注册表单数据 */
export interface RegisterFormData {
    email: string;
    nickname: string;
    password: string;
    phone?: string;
    email_verification_code: string;
    img_verification_code: string;
}

/** 获取账户数据 */
export interface GetAccount {
    nickname: string;
    email: string;
    phone: string;
    avatar: string;
}
