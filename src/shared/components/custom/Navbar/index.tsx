'use client'

import { Button } from '@shared/components/ui/shadcn/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@shared/components/ui/shadcn/sheet'
import { frontendNavigation } from '@shared/config/navigation.config'
import { siteConfig } from '@shared/config/site.config'
import { cn } from '@shared/lib/utils'
import {
  Menu,
  User,
  Moon,
  Sun,
  Home, // Added
  Newspaper, // Added
  Heart, // Added
  Link as LinkIcon // Added and renamed
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '@shared/components/custom/Logo'
import React from 'react'

// 公共样式
const iconButtonStyles =
  'h-9 w-9 p-0 opacity-85 hover:opacity-100 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-200'
const iconStyles = 'h-[18px] w-[18px]'
const linkStyles = {
  base: 'font-medium transition-colors duration-200',
  active: 'text-foreground font-semibold',
  inactive: 'text-foreground/80 hover:text-foreground hover:font-medium'
}

// 主题切换按钮组件
const ThemeButton = React.memo(() => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Button
      className={iconButtonStyles}
      size='icon'
      variant='ghost'
      aria-label='切换主题'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {mounted &&
        (theme === 'dark' ? (
          <Sun className={iconStyles} />
        ) : (
          <Moon className={iconStyles} />
        ))}
      <span className='sr-only'>切换主题</span>
    </Button>
  )
})
ThemeButton.displayName = 'ThemeButton'

// 图标映射 (全局定义)
const iconMap: { [key: string]: React.ElementType } = {
  home: Home,
  posts: Newspaper,
  sponsor: Heart,
  friendlinks: LinkIcon
}

// 移动端导航组件
const MobileNav = React.memo(() => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          className={iconButtonStyles}
          size='icon'
          variant='ghost'
          aria-label='打开导航菜单'
        >
          <Menu className={iconStyles} />
          <span className='sr-only'>打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className='w-[300px] pr-0 border-l border-border'
        side='right'
        style={{
          backdropFilter: 'none',
          backgroundColor: mounted
            ? theme === 'dark'
              ? '#09090b'
              : '#ffffff'
            : '#ffffff',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
          opacity: '1',
          WebkitBackdropFilter: 'none'
        }}
      >
        <SheetHeader className='mb-6'>
          <SheetTitle className='text-left'>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2 border-b border-border/5 pb-4'>
            <Link
              className={`flex items-center py-2 text-base ${linkStyles.base} ${linkStyles.inactive}`}
              href='/login'
              onClick={() => setOpen(false)}
              aria-label='登录账户'
            >
              登录
            </Link>
          </div>

          <nav className='flex flex-col gap-2'>
            {frontendNavigation.mainNav.map(item => {
              const isActive = pathname === item.link
              const IconComponent = iconMap[item.icon] // Get icon component
              return (
                <Link
                  key={item.key}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 py-2 text-base', // Added flex, items-center, gap-3
                    linkStyles.base,
                    isActive ? linkStyles.active : linkStyles.inactive
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`导航到${item.title}`}
                >
                  {IconComponent && <IconComponent className={iconStyles} />} {/* Render icon */}
                  {item.title} {/* Render title */}
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
})
MobileNav.displayName = 'MobileNav'

// 导航栏组件
export const Navbar = React.memo(({ className }: { className?: string }) => {
  const pathname = usePathname()

  // 使用全局定义的 iconMap

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border/5 bg-background/90 backdrop-blur-lg',
        className
      )}
    >
      <div className='flex h-14 items-center justify-between px-4 md:px-6 lg:px-8'>
        <div className='flex items-center gap-8'>
          <Logo size='sm' showText={false} />

          <nav className='hidden md:flex gap-8'>
            {frontendNavigation.mainNav.map(item => {
              const IconComponent = iconMap[item.icon] // Get icon component
              return (
                <Link
                  key={item.key}
                  href={item.link}
                  className={cn(
                    'flex items-center gap-2 text-sm', // Added flex, items-center, gap-2
                    linkStyles.base,
                    pathname === item.link
                    ? linkStyles.active
                    : linkStyles.inactive
                )}
                  aria-current={pathname === item.link ? 'page' : undefined}
                  aria-label={`导航到${item.title}`}
                >
                  {IconComponent && <IconComponent className={iconStyles} />} {/* Render icon */}
                  {item.title} {/* Render title */}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden md:flex items-center gap-4'>
            <ThemeButton />
            <Link href='/login' aria-label='登录账户'>
              <Button
                className={iconButtonStyles}
                size='icon'
                variant='ghost'
                aria-label='用户登录'
              >
                <User className={iconStyles} />
                <span className='sr-only'>登录</span>
              </Button>
            </Link>
          </div>

          <div className='flex md:hidden items-center gap-4'>
            <ThemeButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
})
Navbar.displayName = 'Navbar'
