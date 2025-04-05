/**
 * 网站配置接口
 * 企业级站点配置，支持高性能和高扩展性
 */
declare interface SiteConfig {
    // 核心站点标识
    name: string;                     // 站点名称
    description: string;              // 站点描述
    url: string;                      // 网站URL
    language: string;                 // 站点主语言
    copyright: string;                // 版权声明文本

    // UI/主题
    defaultTheme: string;             // 默认主题模式
    fonts?: {
        main: {                       // 主要字体
            className: string;        // 字体类名
            style: Record<string, any>; // 字体样式
        };
        [key: string]: {              // 其他字体
            className: string;
            style: Record<string, any>;
        };
    };
    ui?: {
        animation?: {                 // 动画配置
            enabled: boolean;
            reducedMotion: string;
            preset?: string;          // 动画预设
        };
    };

    // 功能开关
    features?: {
        darkMode?: boolean;           // 深色模式
        comments?: boolean;           // 评论功能
        newsletter?: boolean;         // 新闻通讯
        search?: {                    // 搜索配置
            enabled: boolean;
            type: string;
            indexName?: string;
            apiKey?: string;
        };
    };

    // 链接与作者
    links: Record<string, string>;    // 社交媒体与资源链接
    author: {
        name: string;                 // 作者名称
        email: string;                // 联系邮箱
        url?: string;                 // 作者主页
    };

    // API配置 
    api?: {
        baseUrl: string;              // API基础路径
        timeout?: number;             // 请求超时时间
        retries?: number;             // 请求重试次数
        caching?: boolean;            // API响应缓存
        enableLogging?: boolean;      // 是否启用API日志
    };

    // 备案信息
    beian?: {
        icp?: string;                 // ICP备案号
        company?: string;             // 企业名称
        copyright?: string;           // 版权所有人
        license?: string;             // 营业执照号
        gongan?: {                    // 公安备案信息
            number: string;           // 公安备案号
            province: string;         // 备案省份
        };
    };
}