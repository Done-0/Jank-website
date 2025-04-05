'use client'

import { Card, CardContent } from '@shared/components/ui/shadcn/card'
import { Button } from '@shared/components/ui/shadcn/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Badge } from '@shared/components/ui/shadcn/badge'
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
    base: 'rounded-full px-6 py-5 sm:px-8 sm:py-6 transition-all duration-300 hover:-translate-y-[2px] group',
    outline:
      'border border-border hover:bg-background/80 hover:border-primary/40 hover:shadow-sm',
    primary:
      'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:bg-[hsl(var(--foreground)/0.9)] shadow-sm border-0'
  },
  common: {
    container: 'container px-4 mx-auto',
    section: 'py-14 sm:py-16 md:py-20',
    title: 'text-center max-w-3xl mx-auto mb-10 sm:mb-12',
    heading: 'text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4',
    text: 'text-base sm:text-lg text-[hsl(var(--foreground)/0.8)]'
  }
}

const CONTENT = {
  hero: {
    badge: '轻量级博客系统',
    titleHighlight: 'Jank',
    titleEnd: '博客系统',
    description:
      'Jank，基于 Go 语言开发，是一款极简、低耦合且高扩展的博客系统，后端内存占用仅 13 MB。',
    buttons: { primary: '快速开始', github: 'GitHub' }
  },
  features: {
    badge: '核心特性',
    title: '选择 Jank 的理由',
    description: '专为开发者打造的面向未来式 CMS 系统，性能卓越，扩展无限。'
  },
  tech: {
    badge: '技术选型',
    title: '现代技术栈',
    description: '全面采用未来式技术栈，打造稳定高性能博客。'
  },
  cta: {
    title: '准备好开始您的博客了吗？',
    description: '使用 Jank，快速搭建轻量高效的博客平台。开源免费，最佳体验。',
    buttons: { primary: '立即开始', secondary: '查看文档' }
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
    title: '极简设计',
    description: '基于 Go 语言和 Echo 框架，设计理念强调极简、低耦合、高扩展。',
    icon: ICONS.globe
  },
  {
    title: '高扩展性',
    description: '灵活的架构和易于扩展的功能设计，支持快速定制和功能拓展。',
    icon: ICONS.shield
  },
  {
    title: '高性能',
    description: '采用 Go 语言开发，支持高并发，确保博客运行流畅。',
    icon: ICONS.code
  },
  {
    title: '安全可靠',
    description:
      '结合 JWT 身份验证和 PostgreSQL、Redis 数据存储方案，保证数据安全。',
    icon: ICONS.database
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
          className={`px-3 py-1.5 text-sm font-medium bg-primary/15 hover:bg-primary/25 transition-all duration-300 border-primary/40 animate-pulse-slow ${className}`}
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
    title,
    description
  }: {
    badge: string
    title: string
    description: string
  }) => (
    <div className={STYLES.common.title}>
      <AnimatedBadge className='mb-4'>{badge}</AnimatedBadge>
      <h2 className={STYLES.common.heading}>{title}</h2>
      <p className={`${STYLES.common.text} max-w-2xl mx-auto`}>{description}</p>
    </div>
  )
)
SectionTitle.displayName = 'SectionTitle'

const FeatureCard = memo(({ feature }: { feature: (typeof FEATURES)[0] }) => (
  <Card className='border-border/40 bg-background/95 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-[6px] h-full'>
    <CardContent className='p-6 sm:p-8 flex flex-col items-center text-center h-full'>
      <div className='w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 hover:scale-110 hover:bg-primary/30'>
        {feature.icon}
      </div>
      <h3 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3'>
        {feature.title}
      </h3>
      <p className='text-sm sm:text-base text-[hsl(var(--foreground)/0.8)]'>
        {feature.description}
      </p>
    </CardContent>
  </Card>
))
FeatureCard.displayName = 'FeatureCard'

const TechItem = memo(({ tech }: { tech: (typeof TECH_STACK)[0] }) => (
  <div className='text-center p-4 sm:p-5 rounded-xl border border-transparent transition-all duration-300 hover:bg-muted/30 hover:shadow-sm hover:border-border/40 hover:-translate-y-1 h-full'>
    <div className='text-lg sm:text-xl md:text-2xl font-bold text-primary mb-1 sm:mb-2'>
      {tech.label}
    </div>
    <div className='text-xs sm:text-sm text-[hsl(var(--foreground)/0.8)]'>
      {tech.value}
    </div>
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
          <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-10'>
            {/* 左侧内容 */}
            <div className='w-full md:w-1/2 lg:w-2/5 space-y-4 sm:space-y-5 text-center md:text-left scroll-animate'>
              <AnimatedBadge>{CONTENT.hero.badge}</AnimatedBadge>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight'>
                <span className='text-primary relative'>
                  <span className='relative z-10'>
                    {CONTENT.hero.titleHighlight}
                  </span>
                  <span className='absolute bottom-1 sm:bottom-2 left-0 w-full h-3 bg-primary/30 -z-10 rounded-full'></span>
                </span>
                {CONTENT.hero.titleEnd}
              </h1>
              <p
                className={`${STYLES.common.text} max-w-md md:max-w-full mx-auto md:mx-0`}
              >
                {CONTENT.hero.description}
              </p>
              <div className='flex flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 pt-3'>
                <Button
                  className={`${STYLES.button.base} ${STYLES.button.primary}`}
                  onClick={goToPosts}
                  size='lg'
                >
                  {CONTENT.hero.buttons.primary}
                  <ChevronRight className='ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </Button>
                <Button
                  className={`${STYLES.button.base} ${STYLES.button.outline}`}
                  onClick={openGitHub}
                  variant='outline'
                  size='lg'
                >
                  <GitHubLogoIcon className='mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5' />
                  {CONTENT.hero.buttons.github}
                </Button>
              </div>
            </div>

            {/* 右侧图片 */}
            <div className='w-full md:w-1/2 lg:w-3/5 relative mt-8 md:mt-0 scroll-animate'>
              <div className='absolute inset-0 bg-gradient-radial from-primary/30 via-primary/20 to-transparent opacity-60 rounded-full blur-3xl -z-10 animate-pulse-slow dark:from-primary/25 dark:via-primary/15'></div>
              <div className='rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-gray-300/40 dark:border-gray-700/40 bg-background/80 transition-all duration-500 hover:shadow-2xl'>
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
      </section>

      {/* Features Section */}
      <section
        className={`${STYLES.common.section} bg-muted/20 scroll-animate`}
        id='features'
      >
        <div className={STYLES.common.container}>
          <SectionTitle
            badge={CONTENT.features.badge}
            title={CONTENT.features.title}
            description={CONTENT.features.description}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'>
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
        <div className='absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/15 to-transparent opacity-50 blur-3xl -z-10'></div>
        <div className='absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/15 to-transparent opacity-50 blur-3xl -z-10'></div>

        <div className={STYLES.common.container}>
          <SectionTitle
            badge={CONTENT.tech.badge}
            title={CONTENT.tech.title}
            description={CONTENT.tech.description}
          />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto'>
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
        className={`${STYLES.common.section} bg-muted/15 scroll-animate`}
      >
        <div className={STYLES.common.container}>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className={`${STYLES.common.heading} scroll-animate`}>
              {CONTENT.cta.title}
            </h2>
            <p
              className={`${STYLES.common.text} mb-6 sm:mb-8 mx-auto scroll-animate`}
            >
              {CONTENT.cta.description}
            </p>
            <div className='flex flex-wrap justify-center gap-3 sm:gap-4 scroll-animate'>
              <Button
                className={`${STYLES.button.base} ${STYLES.button.primary}`}
                onClick={openGitHub}
                size='lg'
              >
                {CONTENT.cta.buttons.primary}
                <ArrowRight className='ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Button>
              <Button
                className={`${STYLES.button.base} ${STYLES.button.outline}`}
                onClick={goToPosts}
                variant='outline'
                size='lg'
              >
                {CONTENT.cta.buttons.secondary}
                <ChevronRight className='ml-1 sm:ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
