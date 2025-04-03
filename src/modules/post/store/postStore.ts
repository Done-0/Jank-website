'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Post } from '../types/Post'

/**
 * 文章状态接口
 */
export interface PostState {
    currentPost: Post | null
    isLoading: boolean
    postList: Post[]
    setCurrentPost: (post: Post | null) => void
    setIsLoading: (isLoading: boolean) => void
    setPostList: (posts: Post[]) => void
}

/**
 * 文章状态管理
 */
export const usePostStore = create<PostState>()(
    persist(
        (set) => ({
            currentPost: null,
            isLoading: false,
            postList: [],
            setCurrentPost: (post) => set({ currentPost: post }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setPostList: (posts) => set({ postList: posts })
        }),
        {
            name: 'post-storage',
            skipHydration: true,
            partialize: (state) => ({
                currentPost: null,
                isLoading: false,
                postList: state.postList
            })
        }
    )
) 