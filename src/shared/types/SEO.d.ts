/**
 * SEO配置接口
 */
declare interface SEOConfig {
    additionalMetaTags?: Array<{
        content: string;
        name: string;
    }>;
    additionalLinkTags?: Array<{
        rel: string;
        href: string;
        sizes?: string;
        type?: string;
        media?: string;
        as?: string;
        crossOrigin?: string;
    }>;
    alternateLocales?: Array<{
        href: string;
        hrefLang: string;
    }>;
    author: string;
    canonicalUrlPrefix?: string;
    defaultTitle: string;
    description: string;
    keywords: string[];
    language?: string;
    openGraph?: {
        description?: string;
        images?: Array<{
            alt?: string;
            height?: number;
            url: string;
            width?: number;
        }>;
        locale?: string;
        siteName?: string;
        title?: string;
        type?: string;
        url?: string;
    };
    performance?: {
        dnsPreconnect?: string[];
        preconnectOrigins?: string[];
        preloadAssets?: Array<{
            as: string;
            crossOrigin?: string;
            href: string;
            type?: string;
        }>;
        preloadFonts?: boolean;
    };
    structuredData?: {
        [key: string]: Record<string, any> | undefined;
        organization?: Record<string, any>;
        website?: Record<string, any>;
    };
    title: string;
    titleTemplate: string;
    twitter?: {
        cardType?: string;
        description?: string;
        handle?: string;
        site?: string;
        title?: string;
    };
} 