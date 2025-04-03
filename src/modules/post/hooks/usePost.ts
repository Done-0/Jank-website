'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'

import {
    createPostAction,
    deletePostAction,
    getPostDetailAction,
    updatePostAction
} from '../actions/postActions'
import { usePostStore } from '../store/postStore'
import { Post } from '../types/Post'
import {
    CreatePostFormValues,
    PostFormValues,
    UpdatePostFormValues
} from '../validators/form-validators'

/**
 * 文章详情管理钩子
 * 处理单篇文章的创建、获取、更新和删除
 */
export function usePost(autoLoad = false, postId?: number) {
    const router = useRouter()
    const {
        currentPost,
        isLoading: storeIsLoading,
        postList,
        setCurrentPost,
        setIsLoading: setStoreIsLoading,
        setPostList
    } = usePostStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    /**
     * 处理异步操作
     */
    const handleOperation = async <T, R>(
        operation: () => Promise<any>,
        successMessage: string,
        successCallback?: (result: R) => any,
        redirectPath?: string
    ) => {
        setIsLoading(true)
        setStoreIsLoading(true)
        setError(null)

        try {
            const result = await operation()

            if (result.success) {
                toast.success(result.msg || successMessage)
                if (successCallback && result.data) {
                    const callbackResult = successCallback(result.data)
                    if (redirectPath) {
                        router.push(redirectPath)
                    }
                    return callbackResult
                }
                if (redirectPath) {
                    router.push(redirectPath)
                }
                return result.data
            } else {
                const errorMsg = result.msg || result.error || '操作失败'
                setError(errorMsg)
                toast.error(errorMsg)
                return null
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : '操作失败，请重试'
            setError(message)
            toast.error(message)
            console.error('操作错误:', error)
            return null
        } finally {
            setIsLoading(false)
            setStoreIsLoading(false)
        }
    }

    /**
     * 获取文章详情
     */
    const handleGetPostDetail = useCallback(async (id?: number, title?: string) => {
        return handleOperation(
            () => getPostDetailAction(id, title),
            '获取文章详情成功',
            (data: Post) => {
                setCurrentPost(data)
                return data
            }
        )
    }, [])

    /**
     * 创建文章
     */
    const handleCreatePost = useCallback(async (data: PostFormValues) => {
        const apiData: CreatePostFormValues = {
            category_ids: data.tags?.map(tag => parseInt(tag)) || [],
            contentMarkdown: data.content_markdown,
            title: data.title,
            visibility: data.visibility
        }

        return handleOperation(
            () => createPostAction(apiData),
            '创建文章成功',
            (data: Post) => {
                setCurrentPost(data)
                setPostList([data, ...postList])
                return data
            },
            '/posts'
        )
    }, [postList])

    /**
     * 更新文章
     */
    const handleUpdatePost = useCallback(async (id: number, data: PostFormValues) => {
        const apiData: UpdatePostFormValues = {
            id,
            category_ids: data.tags?.map(tag => parseInt(tag)) || [],
            contentMarkdown: data.content_markdown,
            title: data.title,
            visibility: data.visibility
        }

        return handleOperation(
            () => updatePostAction(apiData),
            '更新文章成功',
            (data: Post) => {
                setCurrentPost(data)
                setPostList(
                    postList.map((post) => (post.id === data.id ? data : post))
                )
                return data
            }
        )
    }, [postList])

    /**
     * 删除文章
     */
    const handleDeletePost = useCallback(async (id: number) => {
        return handleOperation(
            () => deletePostAction(id),
            '删除文章成功',
            () => {
                setCurrentPost(null)
                setPostList(postList.filter((post) => post.id !== id))
                return true
            },
            '/posts'
        )
    }, [postList])

    useEffect(() => {
        if (autoLoad && postId) {
            handleGetPostDetail(postId)
        }
    }, [autoLoad, postId, handleGetPostDetail])

    return {
        currentPost,
        error,
        handleCreatePost,
        handleDeletePost,
        handleGetPostDetail,
        handleUpdatePost,
        isLoading: isLoading || storeIsLoading
    }
} 