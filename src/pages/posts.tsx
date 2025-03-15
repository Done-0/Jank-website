import { useState, useCallback, useEffect } from "react";
import { useRequest } from "ahooks";
import { ArticleList } from "@/components/common/MSection/ArticleSection/ArticleList";
import { AvatarCard } from "@/components/common/MSection/AsideSection/AvatarCard";
import { theme } from "../../config/theme.config";
import { fetchPostList } from "@/api/post";
import type { Post } from "@/types/Post";
import { decodeUtils } from "@/utils";

const ITEMS_PER_PAGE = 5;

interface FetchPostsParams {
  page: number;
  pageSize: number;
}

async function fetchAndProcessPosts({ page, pageSize }: FetchPostsParams) {
  const response = await fetchPostList({ page, pageSize });
  if (!response || !response.data || !Array.isArray(response.data.posts)) {
    throw new Error("响应格式不符合预期");
  }

  return {
    posts: response.data.posts.map((post: Post) => ({
      data: {
        id: post.id,
        title: post.title,
        image: post.image,
        visibility: post.visibility,
        content_html: decodeUtils.decodeHtml(
          post.content_html ||
            "哇，这里好像很安静！也许你可以成为第一个留言的人。"
        ),
        categoryIds: post.category_ids || [],
      },
    })),
    totalPages: response.data.totalPages,
  };
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error, run } = useRequest(fetchAndProcessPosts, {
    manual: true,
    loadingDelay: 300,
  });

  const fetchData = useCallback(
    (page: number) => {
      run({ page, pageSize: ITEMS_PER_PAGE });
    },
    [run]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,4fr] gap-2 px-4 mt-4 md:px-0 md:mt-4">
        <AvatarCard {...theme.AvatarCardProps} />
        <div className="flex-1">
          {loading ? (
            <div>加载中...</div>
          ) : error ? (
            <div>哎呀，好像出错了: {error.message}</div>
          ) : (
            <ArticleList
              posts={data?.posts || []}
              totalPages={data?.totalPages || 1}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              redirectEnabled={true}
            />
          )}
        </div>
      </div>
    </>
  );
}
