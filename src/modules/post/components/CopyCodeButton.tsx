'use client'

import { useState, useCallback } from 'react'

interface CopyCodeButtonProps {
  code: string
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    if (!code) return

    try {
      navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1000)
    } catch (error) {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1000)
    }
  }, [code])

  return (
    <button
      onClick={copyToClipboard}
      className='group flex items-center justify-center w-9 h-9 rounded-md cursor-pointer hover:backdrop-brightness-75'
      type='button'
    >
      {isCopied ? (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          className='text-green-400'
        >
          <polyline points='20 6 9 17 4 12'></polyline>
        </svg>
      ) : (
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          className='text-gray-700 dark:text-gray-300 group-hover:text-primary'
        >
          <rect x='9' y='9' width='13' height='13' rx='2'></rect>
          <path d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1'></path>
        </svg>
      )}
    </button>
  )
}
