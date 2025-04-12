'use client'

import { Code2, ExternalLink, Github, Heart, Users } from 'lucide-react'
import Link from 'next/link'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/shadcn/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/shadcn/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui/shadcn/tabs'
import { Badge } from '@/shared/components/ui/shadcn/badge'
import { useEffect, useRef } from 'react'
import { useSeo } from '@shared/providers/SeoProvider'

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  isSponsor?: boolean
}

interface Sponsor {
  username: string
  avatarUrl: string
  profileUrl: string
}

const SPONSORS: Sponsor[] = [
  {
    username: 'vxincode',
    avatarUrl: 'https://github.com/vxincode.png',
    profileUrl: 'https://github.com/vxincode'
  },
  {
    username: 'WowDoers',
    avatarUrl: 'https://github.com/WowDoers.png',
    profileUrl: 'https://github.com/WowDoers'
  }
]

const CONTRIBUTORS = {
  jank: [
    {
      login: 'Done-0',
      avatar_url: 'https://github.com/Done-0.png',
      html_url: 'https://github.com/Done-0',
      contributions: 20
    },
    {
      login: 'yanfd',
      avatar_url: 'https://github.com/yanfd.png',
      html_url: 'https://github.com/yanfd',
      contributions: 2
    },
    {
      login: 'deloz',
      avatar_url: 'https://github.com/deloz.png',
      html_url: 'https://github.com/deloz',
      contributions: 1
    }
  ],
  jankWebsite: [
    {
      login: 'Done-0',
      avatar_url: 'https://github.com/Done-0.png',
      html_url: 'https://github.com/Done-0',
      contributions: 11
    },
    {
      login: 'penn201500',
      avatar_url: 'https://github.com/penn201500.png',
      html_url: 'https://github.com/penn201500',
      contributions: 1
    },
    {
      login: 'goodnighteveryone',
      avatar_url: 'https://github.com/goodnighteveryone.png',
      html_url: 'https://github.com/goodnighteveryone',
      contributions: 3
    }
  ]
}

const markSponsors = (contributors: Contributor[]) =>
  contributors.map(c => ({
    ...c,
    isSponsor: SPONSORS.some(s => s.username === c.login)
  }))

const UserCard = ({
  user,
  contributions,
  isSponsor
}: {
  user: { login: string; avatar_url: string; html_url: string }
  contributions?: number
  isSponsor?: boolean
}) => (
  <div className='flex items-center justify-between p-3 rounded-lg hover:bg-accent'>
    <div className='flex items-center gap-3 scroll-animate'>
      <Avatar className='h-10 w-10 border border-border'>
        <AvatarImage src={user.avatar_url} alt={user.login} />
        <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Link
        href={user.html_url}
        target='_blank'
        rel='noopener noreferrer'
        className='font-medium hover:underline flex items-center gap-1'
      >
        {user.login}
        <ExternalLink className='h-3 w-3 opacity-70' />
      </Link>
    </div>
    <div className='flex gap-2'>
      {isSponsor && (
        <Badge
          variant='outline'
          className='bg-primary/10 text-primary border-primary/20'
        >
          Sponsor
        </Badge>
      )}
      {contributions && (
        <Badge variant='secondary'>{contributions} commits</Badge>
      )}
    </div>
  </div>
)

export default function ContributorsPage() {
  const { setTitle } = useSeo()
  const data = {
    jank: markSponsors(CONTRIBUTORS.jank),
    jankWebsite: markSponsors(CONTRIBUTORS.jankWebsite)
  }

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTitle('赞助者与贡献者')

    abortControllerRef.current = new AbortController()

    return () => {
      setTitle('')

      abortControllerRef.current?.abort()
      abortControllerRef.current = null
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [setTitle])

  return (
    <div className='container max-w-3xl py-12 px-4 mx-auto scroll-animate'>
      <div className='space-y-8 text-center'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold'>项目贡献者与赞助者</h1>
          <p className='text-muted-foreground'>感谢所有支持和贡献项目的人</p>
        </header>

        <Card className='border-primary/20 bg-primary/5'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-primary justify-center'>
              <Heart className='h-5 w-5' />
              赞助者
            </CardTitle>
            <CardDescription className='text-primary/70'>
              感谢以下赞助者的慷慨支持
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-1'>
            {SPONSORS.map(sponsor => (
              <UserCard
                key={sponsor.username}
                user={{
                  login: sponsor.username,
                  avatar_url: sponsor.avatarUrl,
                  html_url: sponsor.profileUrl
                }}
                isSponsor
              />
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue='jank' className='w-full'>
          <TabsList className='flex w-full border rounded-md bg-muted p-1 text-muted-foreground'>
            <TabsTrigger
              value='jank'
              className='flex-1 flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground'
            >
              <Code2 className='h-4 w-4' />
              <span className='ml-1'>Jank ({data.jank.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value='website'
              className='flex-1 flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground'
            >
              <Github className='h-4 w-4' />
              <span className='ml-1'>
                Jank-website ({data.jankWebsite.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='jank' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                  Jank 贡献者
                </CardTitle>
                <CardDescription className='flex justify-center'>
                  <Link
                    href='https://github.com/Done-0/Jank/graphs/contributors'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 hover:underline'
                  >
                    查看 GitHub 贡献统计
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-1'>
                {data.jank.length === 0 ? (
                  <p className='text-center py-4 text-muted-foreground'>
                    暂无贡献者数据
                  </p>
                ) : (
                  data.jank.map(contributor => (
                    <UserCard
                      key={contributor.login}
                      user={contributor}
                      contributions={contributor.contributions}
                      isSponsor={contributor.isSponsor}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='website' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                  Jank-website 贡献者
                </CardTitle>
                <CardDescription className='flex justify-center'>
                  <Link
                    href='https://github.com/Done-0/Jank-website/graphs/contributors'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 hover:underline'
                  >
                    查看 GitHub 贡献统计
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-1'>
                {data.jankWebsite.length === 0 ? (
                  <p className='text-center py-4 text-muted-foreground'>
                    暂无贡献者数据
                  </p>
                ) : (
                  data.jankWebsite.map(contributor => (
                    <UserCard
                      key={contributor.login}
                      user={contributor}
                      contributions={contributor.contributions}
                      isSponsor={contributor.isSponsor}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className='border-primary/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 justify-center'>
              <Github className='h-5 w-5' />
              加入我们
            </CardTitle>
            <CardDescription className='text-center'>
              通过提交 Pull Request 或赞助项目来支持我们
            </CardDescription>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Link
              href='https://github.com/Done-0/Jank'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors'
            >
              <div className='flex items-center gap-2'>
                <Code2 className='h-5 w-5' />
                <span className='font-medium'>Jank</span>
              </div>
              <ExternalLink className='h-4 w-4 opacity-70' />
            </Link>
            <Link
              href='https://github.com/Done-0/Jank-website'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors'
            >
              <div className='flex items-center gap-2'>
                <Github className='h-5 w-5' />
                <span className='font-medium'>Jank-website</span>
              </div>
              <ExternalLink className='h-4 w-4 opacity-70' />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
