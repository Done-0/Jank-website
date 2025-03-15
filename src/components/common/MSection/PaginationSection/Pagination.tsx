import type React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/shadcn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i} className="mx-0.5">
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(i);
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-xl border-none transition-colors duration-200 ${
              currentPage === i
                ? "bg-foreground/10 dark:bg-foreground/10 text-foreground dark:text-foreground"
                : "text-foreground/60 dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination className="py-1.5">
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageClick(currentPage - 1);
            }}
            className={`border-none rounded-xl transition-colors duration-200 ${
              currentPage === 1
                ? "text-foreground/30 dark:text-foreground/30 cursor-not-allowed"
                : "text-foreground/60 dark:text-foreground/60 hover:bg-foreground/10 hover:text-foreground dark:hover:bg-foreground/10 dark:hover:text-foreground"
            }`}
          />
        </PaginationItem>
        {renderPageNumbers()}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis className="text-foreground/60 dark:text-foreground/60" />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageClick(currentPage + 1);
            }}
            className={`border-none rounded-xl transition-colors duration-200 ${
              currentPage === totalPages
                ? "text-foreground/30 dark:text-foreground/30 cursor-not-allowed"
                : "text-foreground/60 dark:text-foreground/60 hover:bg-foreground/10 hover:text-foreground dark:hover:bg-foreground/10 dark:hover:text-foreground"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export { PaginationComponent };
