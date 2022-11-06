const _eapi = (window as any).eapi

export const eapi = {
    getSvg: async (filePath: string): Promise<string> => _eapi.getSvg(filePath),
    updateFilePath: async (path: string = ''): Promise<string> => _eapi.updateFilePath(path),
    updateFile: async (newFile: string) => _eapi.updateFile(newFile),
    openProjectInInkscape: async () => _eapi.openProjectInInkscape(),
    exportSvg: async (svgStr: string) => _eapi.exportSvg(svgStr),
    updatedSvg: async (cb: any) => _eapi.updatedSvg(cb),
    closeApp: async () => _eapi.closeApp()
}