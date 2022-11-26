export class createProjectParams {
    doImportSvg?= false
}

export class saveProjectParams {
    filePath?: string
    data?: any
}

export class loadProjectParams {
    filePath?: string
}

export class loadProjectResult {
    filePath?: string
    data?: any
}

export type updateTempSvgParams = {
    data: string
}