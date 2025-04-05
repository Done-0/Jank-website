'use server'

import { BaseAction, HttpResponse } from '@/shared/lib/api'
import { Post, PostList } from '../types/Post'
import { postService } from '../services/postService'
import {
  CreatePostFormValues,
  UpdatePostFormValues
} from '../validators/form-validators'
import { cache } from 'react'

// 文章服务端操作类
class PostActions extends BaseAction {
  async getPostList(
    page: number,
    pageSize: number
  ): Promise<HttpResponse<PostList>> {
    return this.getList(
      params => postService.fetchPostList(params),
      { page, pageSize },
      '获取文章列表成功',
      '获取文章列表失败'
    )
  }

  // 获取文章详情
  async getPostDetail(
    id?: number,
    title?: string
  ): Promise<HttpResponse<Post>> {
    return this.getDetail(
      params => postService.fetchOnePost(params),
      { id, title },
      '获取文章详情成功',
      '获取文章详情失败'
    )
  }

  // 创建文章
  async createPost(data: CreatePostFormValues): Promise<HttpResponse<Post>> {
    return this.create(
      formData => postService.createOnePost(formData),
      data,
      '创建文章成功',
      '创建文章失败'
    )
  }

  // 更新文章
  async updatePost(data: UpdatePostFormValues): Promise<HttpResponse<Post>> {
    return this.update(
      formData => postService.updateOnePost(formData),
      data,
      '更新文章成功',
      '更新文章失败'
    )
  }

  // 删除文章
  async deletePost(id: number): Promise<HttpResponse<null>> {
    return this.delete(
      params => postService.deleteOnePost(params),
      { id },
      '删除文章成功',
      '删除文章失败'
    )
  }
}

// 单例实例
const postActions = new PostActions()

// 使用短期缓存以减少重复请求
export const getPostListAction = cache(async (page: number, pageSize: number) =>
  postActions.getPostList(page, pageSize)
)

export const getPostDetailAction = cache(async (id?: number, title?: string) =>
  postActions.getPostDetail(id, title)
)

export const createPostAction = async (data: CreatePostFormValues) =>
  postActions.createPost(data)

export const updatePostAction = async (data: UpdatePostFormValues) =>
  postActions.updatePost(data)

export const deletePostAction = async (id: number) => postActions.deletePost(id)
