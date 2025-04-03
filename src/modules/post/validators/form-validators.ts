import { z } from 'zod'

/**
 * 创建文章表单验证模式
 */
export const createPostValidator = z.object({
    category_ids: z.array(z.number()).min(1, '请至少选择一个分类'),
    contentMarkdown: z.string().min(10, '文章内容至少10个字符'),
    image: z.string().optional(),
    title: z.string().min(2, '标题至少2个字符').max(100, '标题最多100个字符'),
    visibility: z.enum(['public', 'private', 'draft']).default('public')
})

/**
 * 更新文章表单验证模式
 */
export const updatePostValidator = z.object({
    category_ids: z.array(z.number()).min(1, '请至少选择一个分类'),
    contentMarkdown: z.string().min(10, '文章内容至少10个字符'),
    id: z.number(),
    image: z.string().optional(),
    title: z.string().min(2, '标题至少2个字符').max(100, '标题最多100个字符'),
    visibility: z.enum(['public', 'private', 'draft']).default('public')
})

/**
 * 文章查询参数验证模式
 */
export const postQueryValidator = z.object({
    id: z.number().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    title: z.string().optional()
})

/**
 * 统一文章表单验证模式（用于表单组件）
 */
export const postSchema = z.object({
    title: z.string().min(2, '标题至少2个字符').max(100, '标题最多100个字符'),
    content_markdown: z.string().min(10, '文章内容至少10个字符'),
    visibility: z.enum(['public', 'private', 'draft']).default('public'),
    tags: z.array(z.string()).default([])
})

export type CreatePostFormValues = z.infer<typeof createPostValidator>
export type UpdatePostFormValues = z.infer<typeof updatePostValidator>
export type PostQueryValues = z.infer<typeof postQueryValidator>
export type PostFormValues = z.infer<typeof postSchema> 