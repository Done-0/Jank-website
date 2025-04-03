import React from 'react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * 自定义分页组件
 */
const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const pages = Math.max(1, totalPages)
  const btnBase = 'w-8 h-8 rounded-md flex items-center justify-center text-sm'
  const btnActive = `${btnBase} bg-[#222] text-white font-medium`
  const btnNormal = `${btnBase} text-muted-foreground hover:text-white hover:bg-[#222]`
  const btnDisabled = `${btnBase} text-muted-foreground/40 cursor-not-allowed`

  // 生成页码按钮
  const renderPageNumbers = () => {
    const items = []
    const maxVisible = 5
    const start = Math.max(1, Math.min(currentPage - 2, pages - maxVisible + 1))
    const end = Math.min(pages, start + maxVisible - 1)

    // 首页和省略号
    if (start > 1) {
      items.push(
        <button
          key={1}
          onClick={() => currentPage !== 1 && onPageChange(1)}
          className={btnNormal}
        >
          1
        </button>
      )
      if (start > 2) {
        items.push(
          <span
            key='start-ellipsis'
            className={`${btnBase} text-muted-foreground`}
          >
            …
          </span>
        )
      }
    }

    // 中间页码
    for (let i = start; i <= end; i++) {
      const isActive = currentPage === i
      items.push(
        <button
          key={i}
          onClick={() => !isActive && onPageChange(i)}
          disabled={isActive}
          aria-current={isActive ? 'page' : undefined}
          className={isActive ? btnActive : btnNormal}
        >
          {i}
        </button>
      )
    }

    // 末页和省略号
    if (end < pages) {
      if (end < pages - 1) {
        items.push(
          <span
            key='end-ellipsis'
            className={`${btnBase} text-muted-foreground`}
          >
            …
          </span>
        )
      }
      items.push(
        <button
          key={pages}
          onClick={() => currentPage !== pages && onPageChange(pages)}
          className={btnNormal}
        >
          {pages}
        </button>
      )
    }

    return items
  }

  return (
    <div className='py-2'>
      <div className='flex items-center gap-1 justify-center'>
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? btnDisabled : btnNormal}
          aria-label='上一页'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m15 18-6-6 6-6' />
          </svg>
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => currentPage < pages && onPageChange(currentPage + 1)}
          disabled={currentPage === pages}
          className={currentPage === pages ? btnDisabled : btnNormal}
          aria-label='下一页'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m9 18 6-6-6-6' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { PaginationComponent }
