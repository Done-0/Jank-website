'use client'

import React, { memo } from 'react'
import { cn } from '@shared/lib/utils/classname'

// 通用SVG渐变定义组件
export const SVGGradient = memo(
  ({
    id,
    type = 'linear',
    stops,
    attributes = {}
  }: {
    id: string
    type?: 'linear' | 'radial'
    stops: Array<{
      offset: string
      stopColor: string
      stopOpacity?: number
    }>
    attributes?: Record<string, string>
  }) => {
    const GradientComponent =
      type === 'linear' ? 'linearGradient' : 'radialGradient'

    return React.createElement(
      GradientComponent,
      { id, ...attributes },
      stops.map((stop, index) => (
        <stop
          key={`${id}-stop-${index}`}
          offset={stop.offset}
          stopColor={stop.stopColor}
          stopOpacity={stop.stopOpacity}
        />
      ))
    )
  }
)
SVGGradient.displayName = 'SVGGradient'

// 通用SVG渐变集合组件
export const SVGGradients = memo(
  ({
    gradients
  }: {
    gradients: Array<{
      id: string
      type?: 'linear' | 'radial'
      stops: Array<{
        offset: string
        stopColor: string
        stopOpacity?: number
      }>
      attributes?: Record<string, string>
    }>
  }) => (
    <defs>
      {gradients.map(gradient => (
        <SVGGradient
          key={gradient.id}
          id={gradient.id}
          type={gradient.type}
          stops={gradient.stops}
          attributes={gradient.attributes}
        />
      ))}
    </defs>
  )
)
SVGGradients.displayName = 'SVGGradients'

// 通用SVG路径组件
export const SVGPath = memo(
  ({
    d,
    fill,
    stroke,
    className,
    ...rest
  }: {
    d: string
    fill?: string
    stroke?: string
    className?: string
    [key: string]: any
  }) => (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      className={cn(className)}
      {...rest}
    />
  )
)
SVGPath.displayName = 'SVGPath'

// 通用SVG矩形组件
export const SVGRect = memo(
  ({
    x = 0,
    y = 0,
    width,
    height,
    rx = 0,
    ry = 0,
    fill,
    stroke,
    className,
    children,
    ...rest
  }: {
    x?: number | string
    y?: number | string
    width: number | string
    height: number | string
    rx?: number | string
    ry?: number | string
    fill?: string
    stroke?: string
    className?: string
    children?: React.ReactNode
    [key: string]: any
  }) => (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      ry={ry}
      fill={fill}
      stroke={stroke}
      className={cn(className)}
      {...rest}
    >
      {children}
    </rect>
  )
)
SVGRect.displayName = 'SVGRect'

// 通用SVG容器组件
export const SVGContainer = memo(
  ({
    width = '100%',
    height = '100%',
    viewBox = '0 0 100 100',
    className,
    children,
    ...rest
  }: {
    width?: number | string
    height?: number | string
    viewBox?: string
    className?: string
    children: React.ReactNode
    [key: string]: any
  }) => (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className={cn(className)}
      {...rest}
    >
      {children}
    </svg>
  )
)
SVGContainer.displayName = 'SVGContainer'
