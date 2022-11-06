/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('eapi', {
  getSvg: (filePath: string): Promise<string> => ipcRenderer.invoke('getSvg', filePath),
  updateFile: (newFile: string) => ipcRenderer.invoke('updateFile', newFile),
  updateFilePath: (path: string) => ipcRenderer.invoke('updateFilePath', path),
  exportSvg: (fileStr: string) => ipcRenderer.invoke('exportSvg', fileStr),
  openProjectInInkscape: () => ipcRenderer.invoke('openProjectInInkscape'),
  closeApp: () => ipcRenderer.invoke('closeApp'),

  updatedSvg: (callback: any) => ipcRenderer.on('updatedSvg', callback),

})
