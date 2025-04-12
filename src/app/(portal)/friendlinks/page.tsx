'use client'

import { useEffect, memo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@shared/components/ui/shadcn/card'
import { ExternalLink, Globe } from 'lucide-react'
import Link from 'next/link'
import { useSeo } from '@shared/providers/SeoProvider'
import { Badge } from '@shared/components/ui/shadcn/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@shared/components/ui/shadcn/avatar'

const formatUrl = (domain: string) =>
  domain.startsWith('http://') || domain.startsWith('https://')
    ? domain
    : `https://${domain}`

const FRIEND_LINKS = [
  {
    name: 'kengni',
    url: 'www.kengni.com',
    category: '技术博客',
    avatar: ''
  },
  {
    name: 'wypnote',
    url: 'wypnote.github.io',
    category: '技术博客',
    avatar: ''
  }
]

const FriendLinkItem = memo(
  ({ link }: { link: (typeof FRIEND_LINKS)[number] }) => {
    const fullUrl = formatUrl(link.url)

    return (
      <div className='flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-10 w-10 border border-border'>
            <AvatarImage
              src={link.avatar || `${fullUrl}/favicon.ico`}
              alt={link.name}
              loading='lazy'
            />
            <AvatarFallback>{link.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Link
            href={fullUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium hover:underline flex items-center gap-1'
          >
            {link.name}
            <ExternalLink className='h-3 w-3 opacity-70' />
          </Link>
        </div>
        <Badge variant='outline' className='text-xs font-normal'>
          {link.category}
        </Badge>
      </div>
    )
  }
)

FriendLinkItem.displayName = 'FriendLinkItem'

export default function FriendLinksPage() {
  const { setTitle } = useSeo()

  useEffect(() => {
    setTitle('友情链接')
    return () => setTitle('')
  }, [setTitle])

  return (
    <div className='container max-w-3xl py-8 px-4 mx-auto scroll-animate'>
      <div className='space-y-8 text-center'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>友情链接</h1>
          <p className='text-muted-foreground'>精选优质网站，互相交流成长</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 justify-center'>
              <Globe className='h-5 w-5 text-primary' />
              优质站点推荐
            </CardTitle>
            <CardDescription className='text-center'>
              优质资源导航
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-1'>
            {FRIEND_LINKS.map(link => (
              <FriendLinkItem key={link.url} link={link} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
