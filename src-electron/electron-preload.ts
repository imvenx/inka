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
import { createProjectParams, loadProjectParams, saveProjectParams, updateTempSvgParams } from 'app/public/sharedModels'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('eapi', {
  createProject: (p: createProjectParams) => ipcRenderer.invoke('createProject', p),
  loadProject: (p: loadProjectParams) => ipcRenderer.invoke('loadProject', p),
  saveProject: (p: saveProjectParams) => ipcRenderer.invoke('saveProject', p),
  getTempSvg: () => ipcRenderer.invoke('getTempSvg'),
  updateTempSvg: (p: updateTempSvgParams) => ipcRenderer.invoke('updateTempSvg', p),
  // getSvg: (filePath: string): Promise<string> => ipcRenderer.invoke('getSvg', filePath),
  // updateFile: (newFile: string) => ipcRenderer.invoke('updateFile', newFile),
  // updateFilePath: (path: string) => ipcRenderer.invoke('updateFilePath', path),
  // exportSvg: (fileStr: string) => ipcRenderer.invoke('exportSvg', fileStr),
  openProjectInInkscape: () => ipcRenderer.invoke('openProjectInInkscape'),
  closeApp: () => ipcRenderer.invoke('closeApp'),
  // writeProject: (folder: string, path: string, data: string) => ipcRenderer.invoke('writeProject', folder, path, data),

  updatedSvg: (callback: any) => ipcRenderer.on('updatedSvg', callback),

})
