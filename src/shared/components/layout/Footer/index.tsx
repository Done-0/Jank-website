'use client'

import { siteConfig } from '@/shared/config/site.config'
import Link from 'next/link'
import React from 'react'

/**
 * 页脚属性接口
 */
export interface FooterProps {
  /** 自定义类名 */
  className?: string
}

/**
 * 彻底固定无偏移页脚组件
 */
export const MainFooter = React.memo(({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  const beianIcp = siteConfig.beian?.icp

  return (
    <footer
      className={`py-6 border-t border-border/5 ${className}`}
      style={{ minHeight: '64px' }}
    >
      <div className='container mx-auto px-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between items-center'>
          <p className='text-xs text-muted-foreground mb-2 sm:mb-0 min-h-[20px]'>
            © {currentYear} {siteConfig.name}. 保留所有权利。
          </p>

          <div className='min-h-[20px]'>
            {beianIcp ? (
              <Link
                className='text-xs text-muted-foreground hover:text-muted-foreground/80'
                href='https://beian.miit.gov.cn/'
                rel='noopener noreferrer'
                target='_blank'
              >
                {beianIcp}
              </Link>
            ) : (
              <span className='text-xs invisible'>&nbsp;</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
})

MainFooter.displayName = 'MainFooter'

// 导出别名以保持向后兼容
export const MinimalFooter = MainFooter
export const Footer = MainFooter
export const SimpleFooter = MainFooter
