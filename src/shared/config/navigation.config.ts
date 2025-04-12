/**
 * 前台导航配置
 */
export const frontendNavigation = {
  mainNav: [
    {
      icon: 'home',
      key: 'home',
      link: '/',
      title: '首页'
    },
    {
      icon: 'posts',
      key: 'posts',
      link: '/posts',
      title: '文章'
    },
    {
      icon: 'sponsor',
      key: 'sponsor',
      link: '/sponsor',
      title: '赞助'
    },
    {
      icon: 'friendlinks',
      key: 'friendlinks',
      link: '/friendlinks',
      title: '友链'
    }
  ] as MenuItem[]
}

/**
 * 后台导航配置
 */
export const consoleNavigation = {
  mainNav: [
    {
      icon: 'layout-dashboard',
      key: 'dashboard',
      link: '/console',
      title: '仪表盘'
    },
    {
      icon: 'file-text',
      key: 'articles',
      link: '/console/articles',
      title: '文章管理'
    },
    {
      icon: 'folder',
      key: 'categories',
      link: '/console/categories',
      title: '分类管理'
    },
    {
      icon: 'tag',
      key: 'tags',
      link: '/console/tags',
      title: '标签管理'
    },
    {
      icon: 'image',
      key: 'media',
      link: '/console/media',
      title: '媒体管理'
    },
    {
      icon: 'message-square',
      key: 'comments',
      link: '/console/comments',
      title: '评论管理'
    },
    {
      icon: 'users',
      key: 'users',
      link: '/console/users',
      title: '用户管理'
    },
    {
      icon: 'settings',
      key: 'settings',
      link: '/console/settings',
      title: '系统设置'
    }
  ] as MenuItem[]
}
