import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg'
  text?: string
}

export function Loading({
  size = 'default',
  text,
  className,
  ...props
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-2',
        className
      )}
      {...props}
    >
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  height?: string
}

export function LoadingSkeleton({
  count = 1,
  height = 'h-12',
  className,
  ...props
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-4" {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-md bg-muted',
            height,
            className
          )}
        />
      ))}
    </div>
  )
} 