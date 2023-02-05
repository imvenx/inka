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
  exportSvg: (fileStr: string) => ipcRenderer.invoke('exportSvg', fileStr),
  openSvgWithDefaultProgram: () => ipcRenderer.invoke('openSvgWithDefaultProgram'),
  openSvgWithInkscape: () => ipcRenderer.invoke('openSvgWithInkscape'),
  resetInkscapePath: () => ipcRenderer.invoke('resetInkscapePath'),
  closeApp: () => ipcRenderer.invoke('closeApp'),
  updatedSvg: (callback: any) => ipcRenderer.on('updatedSvg', callback),
})
