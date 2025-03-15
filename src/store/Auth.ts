import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '@/types/Auth';
import type { GetAccount } from '@/types/Account';

interface AuthStore extends AuthState {
    /** 用户信息 */
    userInfo?: GetAccount;
    /** 设置认证状态 */
    setAuth: (auth: AuthState) => void;
    /** 更新认证状态 */
    updateAuth: (accessToken: string, refreshToken: string) => void;
    /** 清除认证状态 */
    clearAuth: () => void;
    /** 设置用户信息 */
    setUserInfo: (userInfo: GetAccount) => void;
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: '',
            refreshToken: '',
            userInfo: undefined,
            setAuth: (auth: AuthState) => set(auth),
            updateAuth: (accessToken: string, refreshToken: string) =>
                set({ accessToken, refreshToken }),
            clearAuth: () =>
                set({ accessToken: '', refreshToken: '', userInfo: undefined }),
            setUserInfo: (userInfo: GetAccount) => set({ userInfo })
        }),
        {
            name: 'auth-storage',
        }
    )
);

export { useAuthStore };