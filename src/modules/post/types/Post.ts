/** 文章数据 */
export interface Post {
    category_ids: number[]
    content_html: string
    content_markdown: string
    id: number
    image: string
    title: string
    visibility: string
}

/** 文章列表响应 */
export interface PostList {
    posts: Post[]
    totalPages: number
    currentPage: number
}

/** 文章列表查询参数 */
export interface PostListQuery {
    page: number
    pageSize: number
}

/** 文章详情查询参数 */
export interface PostDetailQuery {
    id?: number
    title?: string
}

/** 创建文章请求参数 */
export interface CreatePostRequest {
    category_ids: number[]
    contentMarkdown: string
    image?: string
    title: string
    visibility?: string
}

/** 更新文章请求参数 */
export interface UpdatePostRequest {
    category_ids: number[]
    contentMarkdown: string
    id: number
    image?: string
    title: string
    visibility?: string
}

/** 删除文章请求参数 */
export interface DeletePostRequest {
    id: number
} 