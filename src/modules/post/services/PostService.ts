import { BaseService, HttpResponse } from '@/shared/lib/api'
import {
  CreatePostRequest,
  DeletePostRequest,
  Post,
  PostDetailQuery,
  PostList,
  PostListQuery,
  UpdatePostRequest
} from '../types/Post'

/**
 * 文章服务类
 * 封装文章相关API调用
 */
export class PostService extends BaseService {
  constructor() {
    super({
      baseUrl: '/v1/post',
      useClientApi: false,
      serviceName: 'PostService',
      silent: true
    })
  }

  /**
   * 获取文章列表
   */
  async fetchPostList(params: PostListQuery): Promise<HttpResponse<PostList>> {
    const { page, pageSize } = params
    return this.get<PostList>(`/getAllPosts?pageSize=${pageSize}&page=${page}`)
  }

  /**
   * 获取文章详情
   */
  async fetchOnePost(data: PostDetailQuery): Promise<HttpResponse<Post>> {
    const { id, title } = data
    if (!id && !title) {
      throw new Error('请提供文章id或标题')
    }
    return this.post<Post>('/getOnePost', data)
  }

  /**
   * 创建文章
   */
  async createOnePost(data: CreatePostRequest): Promise<HttpResponse<Post>> {
    return this.post<Post>('/createOnePost', data)
  }

  /**
   * 更新文章
   */
  async updateOnePost(data: UpdatePostRequest): Promise<HttpResponse<Post>> {
    return this.post<Post>('/updateOnePost', data)
  }

  /**
   * 删除文章
   */
  async deleteOnePost(data: DeletePostRequest): Promise<HttpResponse<null>> {
    return this.delete<null>('/deleteOnePost', data)
  }
}

// 单例实例
export const postService = new PostService()
