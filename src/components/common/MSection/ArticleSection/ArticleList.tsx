import React from "react";
import { Card, CardContent } from "@/components/ui/shadcn";
import { PaginationComponent } from "@/components/common/MSection/PaginationSection/Pagination";
import { history } from "umi";
import parse from "html-react-parser";
import type { HttpResponse, Post } from "@/types";

type ArticleListProps = {
  posts: HttpResponse<Post>[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  redirectEnabled?: boolean;
};

const ArticleList: React.FC<ArticleListProps> = ({
  posts,
  totalPages,
  currentPage,
  onPageChange,
  redirectEnabled = false,
}) => {
  const processText = (html: string): string => {
    const cleanText = (text: string): string =>
      text.replace(/�/g, "").replace(/\s+/g, " ").trim();

    const extractTextFromNode = (node: React.ReactNode): string =>
      typeof node === "string"
        ? node
        : Array.isArray(node)
          ? node.map(extractTextFromNode).join("")
          : React.isValidElement(node)
            ? extractTextFromNode(node.props.children)
            : "";

    const text = extractTextFromNode(parse(html));
    return cleanText(text);
  };

  const handleCardClick = (postId: number) =>
    redirectEnabled && history.push(`/posts/${postId}`);

  return (
    <div>
      <Card className="w-full">
        <CardContent className="space-y-4 p-4 w-full">
          {posts.map(({ data }) => (
            <div
              key={data.id}
              className="group flex md:h-[135px] h-[100px] overflow-hidden rounded-xl border hover:shadow-xl cursor-pointer"
              onClick={() => handleCardClick(data.id)}
            >
              <div className="relative w-1/3 overflow-hidden">
                <img
                  src={data.image || "@/assets/images/loading.svg"}
                  alt={data.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="h-full w-2/3 border-l">
                <div className="flex flex-col justify-center space-y-2 p-4 sm:p-5 md:p-6 transition-transform duration-500 ease-out group-hover:translate-x-3">
                  <h3 className="md:text-xl">{data.title}</h3>
                  <p className="text-sm text-muted-foreground overflow-hidden overflow-ellipsis line-clamp-1">
                    {processText(data.content_html)}
                    {data.content_html.length > 40 && "..."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="border mx-14"></div>

        <div className="py-4">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export { ArticleList };
