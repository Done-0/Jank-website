/**
 * 网站配置接口
 * 企业级站点配置，支持高性能和高扩展性
 */
declare interface SiteConfig {
    // API配置
    api?: {
        baseUrl: string;              // API基础路径
        caching?: boolean;            // API响应缓存
        retries?: number;             // 请求重试次数
        timeout?: number;             // 请求超时时间
    };
    // 作者信息
    author: {
        email: string;                // 联系邮箱
        name: string;                 // 作者名称
        url?: string;                 // 作者主页
    };
    // 企业备案信息
    beian?: {
        company?: string;             // 企业名称
        copyright?: string;           // 版权所有人
        gongan?: {                    // 公安备案信息
            number: string;           // 公安备案号
            province: string;         // 备案省份
        };
        icp?: string;                 // ICP备案号
        license?: string;             // 营业执照号
    };
    // 内容配置
    content?: {
        contentSecurity?: {           // 内容安全
            allowedTags?: string[];
            sanitize?: boolean;
        };
        defaultAuthor?: string;       // 默认作者
        excerptLength?: number;       // 摘要长度
        postsPerPage?: number;        // 每页文章数
        taxonomies?: string[];        // 分类方式
    };

    // 版权信息
    copyright: string;                // 版权声明文本

    // 主题与用户界面
    defaultTheme: string;             // 默认主题模式

    description: string;              // 站点描述

    // 功能特性开关
    features?: {
        analytics?: {                 // 分析配置
            anonymizeIp?: boolean;
            enabled: boolean;
            provider: string;
            trackingId?: string;
        };
        comments?: boolean;           // 评论功能
        darkMode?: boolean;           // 深色模式
        newsletter?: boolean;         // 新闻通讯
        search?: {                    // 搜索配置
            apiKey?: string;
            enabled: boolean;
            indexName?: string;
            type: string;
        };
    };

    // 字体配置
    fonts?: {
        [key: string]: {              // 其他字体
            className: string;
            style: Record<string, any>;
        };
        main: {                       // 主要字体
            className: string;        // 字体类名
            style: Record<string, any>; // 字体样式
        };
    };

    language: string;                 // 站点主语言

    // 外部链接集合
    links: Record<string, string>;    // 社交媒体与资源链接

    // 本地化与国际化
    localization?: {
        defaultLocale: string;        // 默认语言
        fallbackLocale: string;       // 回退语言
        locales: Array<{              // 支持的语言
            code: string;             // 语言代码
            dateFormat: string;       // 日期格式
            dir: 'ltr' | 'rtl';       // 文字方向
            name: string;             // 语言名称
        }>;
    };

    // 核心站点信息
    name: string;                     // 站点名称

    // 性能优化配置
    performance?: {
        cacheStrategy?: string;       // 缓存策略
        imageOptimization?: boolean;  // 图片优化
        lazyLoading?: boolean;        // 懒加载支持
        prefetch?: boolean;           // 资源预加载
    };

    // 安全配置
    security?: {
        contentSecurityPolicy?: boolean;  // 内容安全策略
        frameDeny?: boolean;              // 禁止iframe嵌入
        xssProtection?: boolean;          // XSS保护
    };

    // UI/UX配置
    ui?: {
        animation?: {                 // 动画配置
            enabled: boolean;
            reducedMotion: string;
            preset?: string;          // 动画预设
        };
        layout?: {                    // 布局配置
            maxWidth: string;
            navPosition: string;
        };
        logo?: {                      // Logo配置
            dark: string;
            light: string;
        };
        typography?: {                // 排版配置
            fontFamily?: {
                mono: string;
                sans: string;
            };
            fontSize?: {
                base: string;
            };
        };
    };

    url: string;                      // 网站URL
}