import { siteConfig } from '@shared/config/site.config'
import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'

/**
 * 文章数据接口
 */
interface Post {
  author?: string
  categories?: string[]
  content: string
  date: string
  excerpt: string
  slug: string
  tags?: string[]
  title: string
}

/**
 * 生成RSS订阅源
 * @param posts 文章数据列表
 * @param outputPath 输出路径，默认为public目录
 */
export async function generateRSSFeed(
  posts: Post[],
  outputPath: string = './public'
) {
  // 确保输出目录存在
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // 创建Feed实例
  const feed = new Feed({
    author: {
      email: siteConfig.author.email,
      link: siteConfig.url,
      name: siteConfig.author.name
    },
    copyright: siteConfig.copyright,
    description: siteConfig.description,
    favicon: `${siteConfig.url}/favicon.ico`,
    feedLinks: {
      atom: `${siteConfig.url}/atom.xml`,
      json: `${siteConfig.url}/feed.json`,
      rss2: `${siteConfig.url}/rss.xml`
    },
    id: siteConfig.url,
    language: siteConfig.language,
    link: siteConfig.url,
    title: siteConfig.name
  })

  // 为每篇文章添加条目
  posts.forEach(post => {
    const url = `${siteConfig.url}/posts/${post.slug}`

    feed.addItem({
      author: [
        {
          email: siteConfig.author.email,
          link: siteConfig.url,
          name: post.author || siteConfig.author.name
        }
      ],
      content: post.content,
      date: new Date(post.date),
      description: post.excerpt,
      id: url,
      link: url,
      title: post.title,
      // 可选：添加分类和标签
      ...(post.categories && {
        category: post.categories.map(category => ({
          name: category
        }))
      }),
      ...(post.tags && { extensions: [{ name: 'tags', objects: post.tags }] })
    })
  })

  // 生成RSS 2.0
  fs.writeFileSync(path.join(outputPath, 'rss.xml'), feed.rss2())

  // 生成Atom 1.0
  fs.writeFileSync(path.join(outputPath, 'atom.xml'), feed.atom1())

  // 生成JSON Feed 1.0
  fs.writeFileSync(path.join(outputPath, 'feed.json'), feed.json1())

  console.log('RSS feeds generated successfully!')
}

/**
 * 定期更新RSS Feed
 * 可以在构建时或者通过定时任务调用
 */
export async function updateRSSFeed(posts: Post[]) {
  try {
    await generateRSSFeed(posts)
    return { message: 'RSS feeds updated successfully', success: true }
  } catch (error) {
    console.error('Failed to update RSS feeds:', error)
    return {
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to update RSS feeds',
      success: false
    }
  }
}
