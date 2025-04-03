import { serverHttp, HttpResponse } from '@/shared/lib/api/http'

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
 * 服务器端文章服务
 * 负责所有直接的API通信，专门用于服务器组件和服务器操作（Server Actions）
 */

/**
 * 获取文章列表
 */
export const fetchPostList = (
    data: PostListQuery
): Promise<HttpResponse<PostList>> => {
    const { page, pageSize } = data
    return serverHttp.get(`/v1/post/getAllPosts?pageSize=${pageSize}&page=${page}`)
}

/**
 * 获取文章详情
 */
export const fetchOnePost = (
    data: PostDetailQuery
): Promise<HttpResponse<Post>> => {
    const { id, title } = data
    if (!id && !title) {
        throw new Error('请提供文章id或标题')
    }
    return serverHttp.post('/v1/post/getOnePost', data)
}

/**
 * 创建文章
 */
export const createOnePost = (
    data: CreatePostRequest
): Promise<HttpResponse<Post>> => {
    return serverHttp.post('/v1/post/createOnePost', data)
}

/**
 * 更新文章
 */
export const updateOnePost = (
    data: UpdatePostRequest
): Promise<HttpResponse<Post>> => {
    return serverHttp.post('/v1/post/updateOnePost', data)
}

/**
 * 删除文章
 */
export const deleteOnePost = (
    data: DeletePostRequest
): Promise<HttpResponse<null>> => {
    return serverHttp.delete('/v1/post/deleteOnePost', { data })
} 