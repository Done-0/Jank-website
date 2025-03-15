import type { HttpResponse } from '@/types/HttpType';
import http from '@/lib/axios';

/* 获取文章列表 */
export const fetchPostList = (data: { page: number, pageSize: number }): Promise<HttpResponse<any>> => {
  const { page, pageSize } = data;
  return http.get(`/v1/post/getAllPosts?pageSize=${pageSize}&page=${page}`);
};

/** 获取文章详情 */
export const fetchOnePost = (data: { id?: number, title?: string }): Promise<HttpResponse<any>> => {
  const { id, title } = data;
  if (!id && !title) {
    throw new Error('请提供文章id或标题');
  }
  return http.post('/v1/post/getOnePost', data);
};

/** 创建文章 */
export const createOnePost = (data: {
  contentMarkdown: string,
  image?: string,
  title: string,
  visibility?: string,
  category_ids: number[]
}): Promise<HttpResponse<any>> => {
  return http.post('/post/createOnePost', data);
};

/** 更新文章 */
export const updateOnePost = (data: {
  contentMarkdown: string,
  image?: string,
  title: string,
  visibility?: string,
  category_ids: number[]
}): Promise<HttpResponse<any>> => {
  return http.post('/v1/post/updateOnePost', data);
};

/** 删除文章 */
export const deleteOnePost = (data: { id: number }): Promise<HttpResponse<any>> => {
  return http.delete('/v1/post/deleteOnePost', data);
};
