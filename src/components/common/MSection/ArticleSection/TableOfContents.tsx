import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  contentRef: React.RefObject<HTMLDivElement>;
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ contentRef }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!contentRef.current) return;

    // 提取文章中的所有标题元素
    const elements = contentRef.current.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );

    const headingElements: Heading[] = Array.from(elements).map((element) => {
      // 确保每个标题都有ID，如果没有则创建一个
      if (!element.id) {
        element.id =
          element.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "") ||
          `heading-${Math.random().toString(36).substr(2, 9)}`;
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1), 10),
      };
    });

    setHeadings(headingElements);

    // 设置滚动监听，高亮当前可见的标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px", threshold: 0.1 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [contentRef]);

  // 即使没有标题也显示目录卡片
  const hasHeadings = headings.length > 0;

  // 使用useMemo缓存目录项的渲染结果
  const tableOfContentsItems = useMemo(() => {
    return headings.map((heading) => {
      // 计算缩进类名
      const indentClass = `pl-${Math.min(8, (heading.level - 1) * 2)}`;

      return (
        <li
          key={heading.id}
          className={`${indentClass} transition-colors duration-200`}
        >
          <a
            href={`#${heading.id}`}
            className={`block py-1 text-sm hover:text-foreground transition-colors ${
              activeId === heading.id
                ? "text-foreground font-medium"
                : "text-foreground/60"
            }`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            {heading.text}
          </a>
        </li>
      );
    });
  }, [headings, activeId]);

  return (
    <Card className="sticky top-20 max-h-[calc(100vh-120px)] overflow-auto will-change-transform">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">目录</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {hasHeadings ? (
          <nav>
            <ul className="space-y-1">{tableOfContentsItems}</ul>
          </nav>
        ) : (
          <p className="text-sm text-foreground/60 italic">暂无目录</p>
        )}
      </CardContent>
    </Card>
  );
};

export { TableOfContents };
