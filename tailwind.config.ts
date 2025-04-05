/**
 * Tailwind CSS配置文件
 *
 * 定义项目中Tailwind CSS的自定义设置、主题和插件
 * 包括颜色方案、字体、动画和组件样式等
 */
import type { Config } from 'tailwindcss'

import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [typography]
}

export default config
