"use client";
import { Card, CardContent, Button } from "@/components/ui/shadcn";
import {
  ArrowRight,
  Code,
  Database,
  Globe,
  Shield,
  Github,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef, memo } from "react";

const STYLES = {
  button: {
    base: "rounded-full px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300 hover:translate-y-[-2px] group",
    primary: "hover:shadow-md hover:shadow-primary/10",
    outline: "hover:bg-background/80 hover:border-primary/40 hover:shadow-sm",
  },
  section: "py-16 sm:py-20 md:py-24",
  container: "container px-4 mx-auto",
  sectionAnimation: "opacity-0 translate-y-10 transition-all duration-500",
};

const CONTENT = {
  hero: {
    badge: "轻量级博客系统",
    title: "简约而不简单-",
    titleHighlight: "Go",
    titleEnd: "博客系统",
    description:
      "Jank 是一个极简、低耦合、高扩展的博客系统，基于 Go 语言，内存占用仅 13 MB。",
    buttons: {
      primary: "快速开始",
      github: "GitHub",
    },
  },
  features: {
    badge: "核心特性",
    title: "选择 Jank 的理由",
    description: "专为开发者打造的面向未来式 CMS 系统，性能卓越，扩展无限。",
  },
  tech: {
    badge: "技术选型",
    title: "现代技术栈",
    description: "全面采用未来式技术栈，打造稳定高性能博客。",
  },
  cta: {
    title: "准备好开始您的博客了吗？",
    description: "使用 Jank，快速搭建轻量高效的博客平台。开源免费，最佳体验。",
    buttons: {
      primary: "立即开始",
      secondary: "查看文档",
    },
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} Jank. 基于 MIT 许可证开源。`,
    links: {
      features: "特性",
      tech: "技术栈",
      docs: "文档",
      github: "GitHub",
    },
  },
};

const SectionTitle = memo(function SectionTitle({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
      <div className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3 sm:mb-4">
        {badge}
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
});

// 特性卡片组件
const FeatureCard = memo(function FeatureCard({ feature }: { feature: any }) {
  return (
    <Card className="border-border/40 bg-background/90 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:translate-y-[-6px] group">
      <CardContent className="p-6 sm:p-8">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
          {feature.icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
});

// 技术栈项组件
const TechItem = memo(function TechItem({ tech }: { tech: any }) {
  return (
    <div className="text-center p-4 sm:p-6 rounded-xl border border-transparent transition-all duration-300 hover:bg-muted/20 hover:shadow-md hover:shadow-primary/5 hover:border-border/30 transform hover:-translate-y-1">
      <div className="text-xl sm:text-3xl font-bold text-primary mb-2 sm:mb-3">
        {tech.label}
      </div>
      <div className="text-sm sm:text-base text-muted-foreground">
        {tech.value}
      </div>
    </div>
  );
});

// 预定义图标组件，避免重复创建
const ICONS = {
  globe: <Globe className="h-6 w-6 text-primary" />,
  shield: <Shield className="h-6 w-6 text-primary" />,
  code: <Code className="h-6 w-6 text-primary" />,
  database: <Database className="h-6 w-6 text-primary" />,
};

const FEATURES = [
  {
    icon: ICONS.globe,
    title: "极简设计",
    description: "基于 Go 语言和 Echo 框架，设计理念强调极简、低耦合、高扩展。",
  },
  {
    icon: ICONS.shield,
    title: "高扩展性",
    description: "灵活的架构和易于扩展的功能设计，支持快速定制和功能拓展。",
  },
  {
    icon: ICONS.code,
    title: "高性能",
    description: "采用 Go 语言开发，支持高并发，确保博客运行流畅。",
  },
  {
    icon: ICONS.database,
    title: "安全可靠",
    description:
      "结合 JWT 身份验证和 PostgreSQL、Redis 数据存储方案，保证数据安全。",
  },
];

const TECH_STACK = [
  { label: "Go", value: "编程语言" },
  { label: "Echo", value: "Web 框架" },
  { label: "PostgreSQL", value: "数据库" },
  { label: "Redis", value: "缓存解决方案" },
];

// 优化后的主组件
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 优化注册section的方式，使用数组而非Set
  const registerSection = (el: HTMLElement | null) => {
    if (!el) return;

    const index = sectionsRef.current.indexOf(el);
    if (index === -1) {
      sectionsRef.current.push(el);
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    }
  };

  // 优化useEffect，减少闭包和内存占用
  useEffect(() => {
    // 使用RAF代替setTimeout，减少计时器开销
    requestAnimationFrame(() => setIsLoaded(true));

    // 创建一个IntersectionObserver实例，使用更高效的配置
    const observer = new IntersectionObserver(
      (entries) => {
        // 批量处理DOM操作，减少重排重绘
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        requestAnimationFrame(() => {
          visibleEntries.forEach((entry) => {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          });
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observerRef.current = observer;

    sectionsRef.current.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      sectionsRef.current = [];
    };
  }, []);

  const openGitHub = () =>
    window.open("https://github.com/Done-0/Jank", "_blank");
  const goToPosts = () => (window.location.href = "/posts");

  return (
    <div
      className={`min-h-screen bg-background transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Hero Section */}
      <section
        ref={registerSection}
        className={`${STYLES.section} overflow-hidden ${STYLES.sectionAnimation}`}
      >
        <div className={STYLES.container}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* 左侧内容 */}
              <div className="w-full md:w-2/5 space-y-5 text-center md:text-left">
                <div className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {CONTENT.hero.badge}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {CONTENT.hero.title}
                  <span className="text-primary relative">
                    <span className="relative z-10">
                      {" "}
                      {CONTENT.hero.titleHighlight}{" "}
                    </span>
                    <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full"></span>
                  </span>
                  {CONTENT.hero.titleEnd}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {CONTENT.hero.description}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-3 sm:pt-4">
                  <Button
                    size="lg"
                    className={`${STYLES.button.base} ${STYLES.button.primary}`}
                  >
                    {CONTENT.hero.buttons.primary}
                    <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`${STYLES.button.base} ${STYLES.button.outline}`}
                    onClick={openGitHub}
                  >
                    <Github className="mr-1 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                    {CONTENT.hero.buttons.github}
                  </Button>
                </div>
              </div>

              {/* 右侧图片 - 优化图片显示方式 */}
              <div className="w-full md:w-3/5 relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent opacity-60 rounded-full blur-3xl -z-10 animate-pulse-slow dark:from-primary/20 dark:via-primary/5"></div>
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-border/60 bg-background/80 transform transition-all duration-500 shadow-gray-600/60 dark:shadow-primary/30 border-gray-500/60 dark:border-primary/40 hover:shadow-2xl hover:shadow-gray-600/70 dark:hover:shadow-primary/40">
                  <div className="relative w-full h-0 pb-[56.25%]">
                    <img
                      src="/images/home-black.png"
                      alt="Jank 博客系统预览"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={registerSection}
        id="features"
        className={`${STYLES.section} bg-muted/10 ${STYLES.sectionAnimation}`}
      >
        <div className={STYLES.container}>
          <SectionTitle
            badge={CONTENT.features.badge}
            title={CONTENT.features.title}
            description={CONTENT.features.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        ref={registerSection}
        id="tech"
        className={`${STYLES.section} relative overflow-hidden ${STYLES.sectionAnimation}`}
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl -z-10"></div>

        <div className={STYLES.container}>
          <SectionTitle
            badge={CONTENT.tech.badge}
            title={CONTENT.tech.title}
            description={CONTENT.tech.description}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {TECH_STACK.map((tech, index) => (
              <TechItem key={index} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={registerSection}
        className={`${STYLES.section} bg-muted/10 ${STYLES.sectionAnimation}`}
      >
        <div className={STYLES.container}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              {CONTENT.cta.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              {CONTENT.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Button
                size="lg"
                className={`${STYLES.button.base} ${STYLES.button.primary}`}
                onClick={openGitHub}
              >
                {CONTENT.cta.buttons.primary}
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`${STYLES.button.base} ${STYLES.button.outline}`}
                onClick={goToPosts}
              >
                {CONTENT.cta.buttons.secondary}
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={registerSection}
        className="py-8 sm:py-12 border-t border-border/20 opacity-0 translate-y-10 transition-all duration-500"
      >
        <div className={STYLES.container}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                {CONTENT.footer.copyright}
              </p>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTENT.footer.links.features}
              </a>
              <a
                href="#tech"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTENT.footer.links.tech}
              </a>
              <a
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTENT.footer.links.docs}
              </a>
              <a
                href="https://github.com/Done-0/Jank"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTENT.footer.links.github}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
