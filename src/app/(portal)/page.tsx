'use client'

import { Card, CardContent } from '@/shared/components/ui/shadcn/card'
import { Button } from '@/shared/components/ui/shadcn/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Badge } from '@/shared/components/ui/shadcn/badge'
import {
  ArrowRight,
  ChevronRight,
  Code,
  Database,
  Globe,
  Shield
} from 'lucide-react'
import Image from 'next/image'
import { memo, useCallback, useEffect, useRef } from 'react'

const STYLES = {
  button: {
    base: 'rounded-full px-5 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-5 md:py-6 lg:py-6 text-sm sm:text-base md:text-lg transition-transform duration-300 hover:translate-y-[-2px] group whitespace-nowrap',
    outline: 'hover:bg-background/80 hover:border-primary/40 hover:shadow-sm',
    primary: 'hover:shadow-md hover:shadow-primary/10'
  },
  card: {
    base: 'border-border/40 bg-background/90 backdrop-blur-sm transition-transform duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:translate-y-[-6px] h-full',
    content: 'p-6 sm:p-8 flex flex-col items-center text-center h-full',
    icon: 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 hover:scale-110 hover:bg-primary/20'
  },
  common: {
    container: 'container px-4 mx-auto',
    section: 'py-16 sm:py-20 md:py-22 lg:py-24',
    heading: 'text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold',
    text: 'text-base sm:text-lg text-muted-foreground'
  },
  tech: {
    base: 'text-center p-4 sm:p-5 rounded-xl border border-transparent transition-transform duration-300 hover:bg-muted/20 hover:shadow-md hover:shadow-primary/5 hover:border-border/30 hover:-translate-y-1 h-full',
    desc: 'text-xs sm:text-sm text-muted-foreground',
    title:
      'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2'
  }
}

const CONTENT = {
  cta: {
    buttons: {
      primary: '立即开始',
      secondary: '查看文档'
    },
    description: '使用 Jank，快速搭建轻量高效的博客平台。开源免费，最佳体验。',
    title: '准备好开始您的博客了吗？'
  },
  features: {
    badge: '核心特性',
    description: '专为开发者打造的面向未来式 CMS 系统，性能卓越，扩展无限。',
    title: '选择 Jank 的理由'
  },
  hero: {
    badge: '轻量级博客系统',
    buttons: {
      github: 'GitHub',
      primary: '快速开始'
    },
    description:
      'Jank，基于 Go 语言开发，是一款极简、低耦合且高扩展的博客系统，后端内存占用仅 13 MB。',
    titleEnd: '博客系统',
    titleHighlight: 'Jank'
  },
  tech: {
    badge: '技术选型',
    description: '全面采用未来式技术栈，打造稳定高性能博客。',
    title: '现代技术栈'
  }
}

const ICONS = {
  code: <Code className='h-6 w-6 text-primary' />,
  database: <Database className='h-6 w-6 text-primary' />,
  globe: <Globe className='h-6 w-6 text-primary' />,
  shield: <Shield className='h-6 w-6 text-primary' />
}

const FEATURES = [
  {
    description: '基于 Go 语言和 Echo 框架，设计理念强调极简、低耦合、高扩展。',
    icon: ICONS.globe,
    title: '极简设计'
  },
  {
    description: '灵活的架构和易于扩展的功能设计，支持快速定制和功能拓展。',
    icon: ICONS.shield,
    title: '高扩展性'
  },
  {
    description: '采用 Go 语言开发，支持高并发，确保博客运行流畅。',
    icon: ICONS.code,
    title: '高性能'
  },
  {
    description:
      '结合 JWT 身份验证和 PostgreSQL、Redis 数据存储方案，保证数据安全。',
    icon: ICONS.database,
    title: '安全可靠'
  }
]

const TECH_STACK = [
  { label: 'Go', value: '编程语言' },
  { label: 'Echo', value: 'Web框架' },
  { label: 'PgSQL', value: '数据库' },
  { label: 'Redis', value: '缓存' }
]

const AnimatedBadge = memo(
  ({
    children,
    className = ''
  }: {
    children: React.ReactNode
    className?: string
  }) => {
    const badgeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const timer = setTimeout(
        () => badgeRef.current?.classList.add('animate-in'),
        100
      )
      return () => clearTimeout(timer)
    }, [])

    return (
      <div ref={badgeRef} className='inline-block'>
        <Badge
          className={`px-3 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-all duration-300 border-primary/30 scroll-animate animate-pulse-slow ${className}`}
          variant='outline'
        >
          {children}
        </Badge>
      </div>
    )
  }
)
AnimatedBadge.displayName = 'AnimatedBadge'

const SectionTitle = memo(
  ({
    badge,
    description,
    title
  }: {
    badge: string
    description: string
    title: string
  }) => (
    <div className='text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16'>
      <AnimatedBadge className='mb-4'>{badge}</AnimatedBadge>
      <h2 className={`${STYLES.common.heading} mb-3 sm:mb-4`}>{title}</h2>
      <p className={`${STYLES.common.text} max-w-xl md:max-w-2xl mx-auto`}>
        {description}
      </p>
    </div>
  )
)
SectionTitle.displayName = 'SectionTitle'

const FeatureCard = memo(({ feature }: { feature: any }) => (
  <Card className={STYLES.card.base}>
    <CardContent className={STYLES.card.content}>
      <div className={STYLES.card.icon}>{feature.icon}</div>
      <h3 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3'>
        {feature.title}
      </h3>
      <p className='text-sm sm:text-base text-muted-foreground'>
        {feature.description}
      </p>
    </CardContent>
  </Card>
))
FeatureCard.displayName = 'FeatureCard'

const TechItem = memo(({ tech }: { tech: any }) => (
  <div className={STYLES.tech.base}>
    <div className={STYLES.tech.title}>{tech.label}</div>
    <div className={STYLES.tech.desc}>{tech.value}</div>
  </div>
))
TechItem.displayName = 'TechItem'

export default function Home() {
  const openGitHub = useCallback(
    () => window.open('https://github.com/Done-0/Jank', '_blank'),
    []
  )

  const goToPosts = useCallback(() => (window.location.href = '/posts'), [])

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section
        className={`${STYLES.common.section} overflow-hidden scroll-animate`}
      >
        <div className={STYLES.common.container}>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-col md:flex-row items-center gap-8 md:gap-10 lg:gap-12'>
              {/* 左侧内容 */}
              <div className='w-full md:w-1/2 lg:w-2/5 space-y-4 sm:space-y-5 text-center md:text-left scroll-animate'>
                <AnimatedBadge>{CONTENT.hero.badge}</AnimatedBadge>
                <h1 className='text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight'>
                  <span className='text-primary relative'>
                    <span className='relative z-10'>
                      {' '}
                      {CONTENT.hero.titleHighlight}{' '}
                    </span>
                    <span className='absolute bottom-1 sm:bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full'></span>
                  </span>
                  {CONTENT.hero.titleEnd}
                </h1>
                <p
                  className={`${STYLES.common.text} max-w-md md:max-w-full mx-auto md:mx-0`}
                >
                  {CONTENT.hero.description}
                </p>
                <div className='flex flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-3 sm:pt-4'>
                  <Button
                    className={`${STYLES.button.base} ${STYLES.button.primary}`}
                    size='lg'
                  >
                    {CONTENT.hero.buttons.primary}
                    <ChevronRight className='ml-1 sm:ml-2 h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1' />
                  </Button>
                  <Button
                    className={`${STYLES.button.base} ${STYLES.button.outline}`}
                    onClick={openGitHub}
                    size='lg'
                    variant='outline'
                  >
                    <GitHubLogoIcon className='mr-1 sm:mr-2 h-5 sm:h-5 md:h-6 w-5 sm:w-5 md:w-6' />
                    {CONTENT.hero.buttons.github}
                  </Button>
                </div>
              </div>

              {/* 右侧图片 */}
              <div className='w-full md:w-1/2 lg:w-3/5 relative mt-8 md:mt-0 scroll-animate'>
                <div className='absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent opacity-60 rounded-full blur-3xl -z-10 animate-pulse-slow dark:from-primary/20 dark:via-primary/5'></div>
                <div className='rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-500/60 bg-background/80 transform transition-all duration-500 shadow-gray-600/60 dark:shadow-primary/30 dark:border-primary/40 hover:shadow-2xl hover:shadow-gray-600/70 dark:hover:shadow-primary/40'>
                  <div className='relative w-full h-0 pb-[56.25%]'>
                    <Image
                      alt='Jank 博客系统预览'
                      className='absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]'
                      decoding='async'
                      fetchPriority='high'
                      height={720}
                      loading='eager'
                      priority
                      src='/images/home-black.png'
                      width={1280}
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
        className={`${STYLES.common.section} bg-muted/10 scroll-animate`}
        id='features'
      >
        <div className={STYLES.common.container}>
          <SectionTitle
            badge={CONTENT.features.badge}
            description={CONTENT.features.description}
            title={CONTENT.features.title}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 lg:gap-8'>
            {FEATURES.map((feature, index) => (
              <div
                className='scroll-animate'
                key={index}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        className={`${STYLES.common.section} relative overflow-hidden scroll-animate`}
        id='tech'
      >
        <div className='absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl -z-10'></div>
        <div className='absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent opacity-60 blur-3xl -z-10'></div>

        <div className={STYLES.common.container}>
          <SectionTitle
            badge={CONTENT.tech.badge}
            description={CONTENT.tech.description}
            title={CONTENT.tech.title}
          />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto'>
            {TECH_STACK.map((tech, index) => (
              <div
                className='scroll-animate'
                key={index}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <TechItem tech={tech} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`${STYLES.common.section} bg-muted/10 scroll-animate`}
      >
        <div className={STYLES.common.container}>
          <div className='max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-center'>
            <h2
              className={`${STYLES.common.heading} mb-4 sm:mb-5 md:mb-6 scroll-animate`}
            >
              {CONTENT.cta.title}
            </h2>
            <p
              className={`${STYLES.common.text} mb-5 sm:mb-6 md:mb-7 lg:mb-8 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto scroll-animate`}
            >
              {CONTENT.cta.description}
            </p>
            <div className='flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 scroll-animate'>
              <Button
                className={`${STYLES.button.base} ${STYLES.button.primary}`}
                onClick={openGitHub}
                size='lg'
              >
                {CONTENT.cta.buttons.primary}
                <ArrowRight className='ml-1 sm:ml-2 h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1' />
              </Button>
              <Button
                className={`${STYLES.button.base} ${STYLES.button.outline}`}
                onClick={goToPosts}
                size='lg'
                variant='outline'
              >
                {CONTENT.cta.buttons.secondary}
                <ChevronRight className='ml-1 sm:ml-2 h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1' />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
