FROM node:20.18.2

# 设置工作目录
WORKDIR /app

# 拷贝 pnpm-lock.yaml 和 package.json
COPY ./package*.json ./

# 配置 npm 使用淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 安装 pnpm
RUN npm install -g pnpm

# 设置 PNPM_HOME 环境变量
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# 配置 pnpm 使用淘宝镜像源
RUN pnpm config set registry https://registry.npmmirror.com/

# 使用 pnpm 安装依赖
RUN pnpm install

# 将前端代码拷贝到容器中
COPY ./ ./

# 构建前端项目
RUN pnpm run build

# 不再需要启动 serve，因为我们使用 nginx 提供服务
CMD ["sh", "-c", "echo 'Frontend build complete. Files are in /app/dist' && tail -f /dev/null"]