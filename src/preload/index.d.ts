import type { DesktopAPI } from './index'

declare global {
  interface Window {
    desktop: DesktopAPI
  }
}

export {}
