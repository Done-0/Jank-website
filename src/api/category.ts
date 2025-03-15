import type { HttpResponse } from '@/types/HttpType';
import http from '@/lib/axios';

/** 获取单个类目 */
export const getOneCategory = (data: {
    id: number;
}): Promise<HttpResponse<any>> =>
    http.post('/v1/category/getOneCategory', data);

/** 获取类目树 */
export const getCategoryTree = (): Promise<HttpResponse<any>> =>
    http.post('/v1/category/getCategoryTree');

/** 创建类目 */
export const creatOneCategory = (data: {
    name: string;
    description?: string;
    parent_id: number;
}): Promise<HttpResponse<any>> =>
    http.post('/v1/category/creatOneCategory', data);

/** 更新类目 */
export const updateOneCategory = (data: {
    name: string;
    description?: string;
    parent_id: number;
}): Promise<HttpResponse<any>> =>
    http.post('/v1/category/updateOneCategory', data);

/** 删除类目 */
export const deleteOneCategory = (data: {
    id: number;
}): Promise<HttpResponse<any>> =>
    http.post('/v1/category/deleteOneCategory', data);

/** 获取类目子列表 */
export const getCategoryChildrenTree = (data: {
    id: number;
}): Promise<HttpResponse<any>> =>
    http.post('/v1/category/getCategoryChildrenTree', data);