import { contextBridge, ipcRenderer } from 'electron'

const desktop = {
  minimize: (): void => ipcRenderer.send('window:minimize'),
  maximize: (): void => ipcRenderer.send('window:maximize'),
  close: (): void => ipcRenderer.send('window:close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:isMaximized'),
  onMaximizeChange: (callback: (maximized: boolean) => void): (() => void) => {
    const listener = (_event: unknown, maximized: boolean): void => callback(maximized)
    ipcRenderer.on('window:maximize-change', listener)
    return () => {
      ipcRenderer.removeListener('window:maximize-change', listener)
    }
  },
}

export type DesktopAPI = typeof desktop

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('desktop', desktop)
  } catch (error) {
    console.error(error)
  }
} else {
  ;(window as unknown as { desktop: DesktopAPI }).desktop = desktop
}
