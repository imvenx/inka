import { createProjectParams, loadProjectParams, loadProjectResult, saveProjectParams, updateTempSvgParams } from "app/public/sharedModels"

// Electron API 
const _eapi = (window as any).eapi

export const eapi = {
    createProject: (p: createProjectParams): Promise<boolean> => _eapi.createProject(p),
    getTempSvg: async (): Promise<string> => _eapi.getTempSvg(),
    // getSvg: async (filePath: string): Promise<string> => _eapi.getSvg(filePath),
    // updateFilePath: async (path: string = ''): Promise<string> => _eapi.updateFilePath(path),
    // updateFile: async (newFile: string) => _eapi.updateFile(newFile),

    openSvgWithInkscape: async () => _eapi.openSvgWithInkscape(),
    openSvgWithDefaultProgram: async () => _eapi.openSvgWithDefaultProgram(),
    loadProject: async (p?: loadProjectParams): Promise<loadProjectResult> => _eapi.loadProject(p),
    saveProject: async (p: saveProjectParams) => _eapi.saveProject(p),
    exportSvg: async (svgStr: string) => _eapi.exportSvg(svgStr),
    askInkscapePath: async () => _eapi.askInkscapePath(),
    updatedSvg: async (cb: any) => _eapi.updatedSvg(cb),

    updateTempSvg: async (p: updateTempSvgParams) => _eapi.updateTempSvg(p),
    closeApp: async () => _eapi.closeApp(),
    // writeProject: async (folder: string, fileName: string, data: string) => await _eapi.writeProject(folder, fileName, data),
}