import { type FC, useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn";
import { useForm } from "react-hook-form";
import { loginAccount, registerAccount, getAccount } from "@/api/account";
import {
  fetchVerificationCode,
  sendVerificationCode,
} from "@/api/verification";
import type { LoginFormData, RegisterFormData } from "@/types";
import { useAuthStore } from "@/store/Auth";

// 验证码按钮组件
const VerificationButton: FC<{
  email: string;
  cooldown: number;
  onRequest: (email: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ email, cooldown, onRequest, disabled, children }) => (
  <Button
    type="button"
    variant="outline"
    className="w-full h-full rounded-lg"
    disabled={!email || cooldown > 0 || disabled}
    onClick={() => onRequest(email)}
  >
    {cooldown > 0 ? `${cooldown}s` : children}
  </Button>
);

const Auth: FC = () => {
  // 对话框状态
  const [authState, setAuthState] = useState<"none" | "login" | "register">(
    "none"
  );
  const [imgVerificationCode, setImgVerificationCode] = useState("");
  const [verificationCooldown, setVerificationCooldown] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [emailCodeSending, setEmailCodeSending] = useState(false);

  // 表单初始化
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      img_verification_code: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      phone: "",
      email_verification_code: "",
      img_verification_code: "",
    },
  });

  // 重置状态
  const resetState = useCallback(() => {
    setImgVerificationCode("");
    setVerificationCooldown(0);
    setCountdown(0);
    setEmailCodeSending(false);
  }, []);

  // 获取图形验证码
  const fetchImgVerificationCode = useCallback(
    async (email: string) => {
      if (!email || verificationCooldown > 0) return;

      try {
        const response = await fetchVerificationCode(email);
        setImgVerificationCode(response.data.imgBase64);
        setVerificationCooldown(3);
      } catch (error) {
        console.error("获取图形验证码失败", error);
      }
    },
    [verificationCooldown]
  );

  // 发送邮箱验证码
  const handleSendEmailCode = useCallback(
    async (email: string) => {
      if (!email || emailCodeSending || countdown > 0) return;

      setEmailCodeSending(true);
      try {
        await sendVerificationCode(email);
        setCountdown(60);
        alert("验证码已发送，请查收邮箱");
      } catch (error) {
        console.error("发送邮箱验证码失败", error);
        alert("发送验证码失败，请稍后重试");
      } finally {
        setEmailCodeSending(false);
      }
    },
    [emailCodeSending, countdown]
  );

  // 处理登录
  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        const response = await loginAccount(data);
        if (response.data) {
          setAuthState("none");
          useAuthStore.getState().setAuth({
            accessToken: response.data.access_token || "",
            refreshToken: response.data.refresh_token || "",
          });
          // 获取用户信息
          const accountInfo = await getAccount(data.email);
          useAuthStore.getState().setUserInfo(accountInfo.data);
          alert("登录成功，即将跳转到管理页面");
          // 登录成功后自动跳转到后台管理页面
          setTimeout(() => {
            window.location.href = "/console";
          }, 1000);
        }
      } catch (error) {
        console.error("登录失败", error);
        alert("登录失败，请检查输入信息");
        fetchImgVerificationCode(data.email);
      }
    },
    [fetchImgVerificationCode]
  );

  // 处理注册
  const handleRegister = useCallback(
    async (data: RegisterFormData) => {
      try {
        const response = await registerAccount(data);
        if (response.data) {
          setAuthState("login");
          alert("注册成功，请登录");
        }
      } catch (error) {
        console.error("注册失败", error);
        alert("注册失败，请检查输入信息");
        fetchImgVerificationCode(data.email);
      }
    },
    [fetchImgVerificationCode]
  );

  // 倒计时处理
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationCooldown > 0) {
      timer = setTimeout(
        () => setVerificationCooldown((prev) => prev - 1),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [verificationCooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 对话框状态变化处理
  const handleDialogChange = useCallback(
    (state: "none" | "login" | "register") => {
      if (authState !== state) {
        resetState();
        setAuthState(state);
      }
    },
    [authState, resetState]
  );

  const { accessToken } = useAuthStore();

  // 如果已登录，显示Admin图标
  if (accessToken) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="shadow-none rounded-full h-9 w-9 text-foreground/80 hover:text-foreground transition-colors hover:bg-transparent"
        onClick={() => (window.location.href = "/console")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Dialog
        open={authState === "login"}
        onOpenChange={(open) => handleDialogChange(open ? "login" : "none")}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shadow-none rounded-full h-9 w-9 text-foreground/80 hover:text-foreground transition-colors hover:bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] sm:w-[480px] md:w-[520px] rounded-2xl p-5 sm:p-7 shadow-lg">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-semibold">登录</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              登录以访问更多功能
            </DialogDescription>
          </DialogHeader>

          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                rules={{
                  required: "请输入邮箱",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "请输入有效的邮箱地址",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">邮箱</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入邮箱"
                        {...field}
                        className="rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                rules={{ required: "请输入密码" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                        className="rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="img_verification_code"
                rules={{ required: "请输入图形验证码" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      图形验证码
                    </FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="请输入验证码"
                          {...field}
                          className="rounded-xl h-11 flex-1"
                        />
                      </FormControl>
                      <div
                        className="w-28 h-11 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border border-input"
                        onClick={() => {
                          const email = loginForm.getValues("email");
                          if (email) fetchImgVerificationCode(email);
                        }}
                      >
                        {imgVerificationCode ? (
                          <img
                            src={imgVerificationCode}
                            alt="验证码"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <VerificationButton
                            email={loginForm.getValues("email")}
                            cooldown={verificationCooldown}
                            onRequest={fetchImgVerificationCode}
                          >
                            获取验证码
                          </VerificationButton>
                        )}
                      </div>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-2">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                  没有账号？
                  <Button
                    type="button"
                    variant="link"
                    className="px-1 h-auto text-sm font-medium"
                    onClick={() => handleDialogChange("register")}
                  >
                    立即注册
                  </Button>
                </p>
                <Button
                  type="submit"
                  className="w-full sm:w-32 h-11 rounded-xl font-medium order-1 sm:order-2"
                >
                  登录
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={authState === "register"}
        onOpenChange={(open) => handleDialogChange(open ? "register" : "none")}
      >
        <DialogContent className="w-[90vw] sm:w-[480px] md:w-[520px] rounded-xl p-4 sm:p-6 shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">注册</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              创建新账号
            </DialogDescription>
          </DialogHeader>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="nickname"
                rules={{ required: "请输入昵称" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">昵称</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入昵称"
                        {...field}
                        className="rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                rules={{
                  required: "请输入邮箱",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "请输入有效的邮箱地址",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">邮箱</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入邮箱"
                        {...field}
                        className="rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                rules={{
                  required: "请输入密码",
                  minLength: {
                    value: 6,
                    message: "密码长度不能小于6位",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                        className="rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="img_verification_code"
                rules={{ required: "请输入图形验证码" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      图形验证码
                    </FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="请输入验证码"
                          {...field}
                          className="rounded-xl h-11"
                        />
                      </FormControl>
                      <div
                        className="w-28 h-11 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border border-input"
                        onClick={() => {
                          const email = registerForm.getValues("email");
                          if (email) fetchImgVerificationCode(email);
                        }}
                      >
                        {imgVerificationCode ? (
                          <img
                            src={imgVerificationCode}
                            alt="验证码"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-full rounded-lg"
                            disabled={
                              !registerForm.getValues("email") ||
                              verificationCooldown > 0
                            }
                          >
                            {verificationCooldown > 0
                              ? `${verificationCooldown}s`
                              : "获取验证码"}
                          </Button>
                        )}
                      </div>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email_verification_code"
                rules={{ required: "请输入邮箱验证码" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      邮箱验证码
                    </FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="请输入邮箱验证码"
                          {...field}
                          className="rounded-xl h-11"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-28 h-11 rounded-xl flex-shrink-0"
                        disabled={
                          !registerForm.getValues("email") ||
                          emailCodeSending ||
                          countdown > 0
                        }
                        onClick={() =>
                          handleSendEmailCode(registerForm.getValues("email"))
                        }
                      >
                        {countdown > 0 ? `${countdown}s` : "发送验证码"}
                      </Button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-2">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                  已有账号？
                  <Button
                    type="button"
                    variant="link"
                    className="px-1 h-auto text-sm font-medium"
                    onClick={() => handleDialogChange("login")}
                  >
                    立即登录
                  </Button>
                </p>
                <Button
                  type="submit"
                  className="w-full sm:w-32 h-11 rounded-xl font-medium order-1 sm:order-2"
                >
                  注册
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
