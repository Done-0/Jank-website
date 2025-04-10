import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@shared/components/ui/shadcn/button'
import { cn } from '@shared/lib/utils'

type AlertType = 'error' | 'warning' | 'info' | 'success'

// 样式配置
const ALERT_STYLES = {
  error: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    icon: 'text-red-500 dark:text-red-400'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
    icon: 'text-amber-500 dark:text-amber-400'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    icon: 'text-blue-500 dark:text-blue-400'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    icon: 'text-green-500 dark:text-green-400'
  }
}

// 图标映射
const ALERT_ICONS = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle
}

interface AlertCardProps {
  type?: AlertType // 警告类型
  title?: string // 标题（可选）
  message: string // 消息内容
  actionLabel?: string // 按钮文本
  onAction?: () => void // 按钮点击事件
  className?: string // 额外CSS类
}

export function AlertCard({
  type = 'error',
  message,
  actionLabel = '刷新',
  onAction,
  className = ''
}: AlertCardProps) {
  const style = ALERT_STYLES[type]
  const IconComponent = ALERT_ICONS[type]

  return (
    <div className={cn('container mx-auto px-4 py-3', className)}>
      <div
        className={cn(
          'py-4 px-4 rounded-md border flex items-center gap-3 mx-auto',
          'max-w-full md:max-w-2xl min-h-[60px]',
          style.bg,
          style.border,
          style.text
        )}
      >
        <IconComponent className={cn('h-5 w-5 flex-shrink-0', style.icon)} />
        <span className='flex-grow break-words'>{message}</span>
        {onAction && (
          <Button
            onClick={onAction}
            variant='ghost'
            size='sm'
            className={cn('flex items-center gap-1 ml-2', style.text)}
          >
            <RefreshCw className='h-4 w-4' />
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export const ErrorDisplay = AlertCard
