/** 认证状态 */
export interface AuthState {
  /** 权限令牌：过期时间 2h */
  accessToken: string;
  /** 刷新令牌: 过期时间 48h */
  refreshToken: string;
}
