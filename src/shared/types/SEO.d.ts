/**
 * SEO配置接口
 * 优化结构，将相关配置按功能分组
 */
export interface SEOConfig {
    /**
     * 基础元数据
     * 包含站点的核心SEO信息
     */
    meta: {
        /** 站点标题 */
        title: string;
        /** 标题模板，用于内页标题 */
        titleTemplate: string;
        /** 站点描述 */
        description: string;
        /** 关键词列表 */
        keywords: string[];
        /** 规范URL，用于避免重复内容问题 */
        canonical?: string;
        /** 作者信息 */
        author?: string;
        /** 站点语言 */
        locale: string;
    };

    /**
     * 社交分享配置
     * 用于社交媒体平台的分享
     */
    social: {
        /** Open Graph协议配置 */
        og: {
            /** 站点名称 */
            siteName: string;
            /** 内容类型 */
            type: 'website' | 'article' | 'profile' | 'book';
            /** 图片配置 */
            images: Array<{
                /** 图片URL */
                url: string;
                /** 图片宽度 */
                width: number;
                /** 图片高度 */
                height: number;
                /** 图片替代文本 */
                alt: string;
            }>;
        };
    };

    /**
     * 结构化数据
     * 用于搜索引擎更好地理解网页内容
     */
    schemas: {
        /** 组织信息 Schema */
        organization: Record<string, any>;
        /** 网站信息 Schema */
        website: Record<string, any>;
    };

    /**
     * 性能优化配置
     * 提高网站加载速度和用户体验
     */
    performance: {
        /** 预连接域名列表 */
        preconnect: string[];
        /** 预加载资源配置 */
        preload: {
            /** 是否预加载字体 */
            fonts: boolean;
        };
    };

    /**
     * 站点资源配置
     * 网站的图标和资源
     */
    assets: {
        /** 图标配置 */
        icons: {
            /** 主要网站图标 */
            favicon: string;
            /** 快捷方式图标 */
            shortcut?: string;
            /** 苹果设备图标 */
            apple?: string;
            /** 其他图标 */
            other?: {
                /** 关系类型 */
                rel: string;
                /** URL地址 */
                url: string;
                /** 尺寸大小 */
                sizes?: string;
            };
        };
    };

    /**
     * 额外配置项
     * 其他需要的meta和link标签
     */
    extra: {
        /** 额外的meta标签 */
        metaTags: Array<{
            /** 标签名称 */
            name: string;
            /** 标签内容 */
            content: string;
        }>;
        /** 额外的link标签 */
        linkTags: Array<{
            /** 关系类型 */
            rel: string;
            /** 链接URL */
            href: string;
            /** 内容类型 */
            type?: string;
            /** 尺寸大小 */
            sizes?: string;
            /** 颜色属性，用于某些特殊图标 */
            color?: string;
        }>;
    };
} 