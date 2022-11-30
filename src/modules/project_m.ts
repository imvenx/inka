import { createProjectParams, loadProjectParams, saveProjectParams } from "app/public/sharedModels"
import { AnimM, svgEl } from "./anim_m"
import { eapi } from "./eapi_m"
import { StorageM } from "./storage_m"
import { SvElM } from "./svel_m"

// let _hasUnsavedChanges = false

export const ProjectM = {
    // get hasUnsavedChanges() { return _hasUnsavedChanges },
    // set hasUnsavedChanges(v: boolean) { _hasUnsavedChanges = v },

    async createProject(params: createProjectParams): Promise<boolean> {
        // if (!this.hasUnsavedChanges) {
        if (!confirm('There may be unsaved changes, do you still want to continue?'))
            return false
        // }
        const success = await eapi.createProject(params)
        if (success) StorageM.clearProject()
        return success
    },

    async openProjectInInkscape() { eapi.openProjectInInkscape() },

    async loadProject(p?: loadProjectParams): Promise<boolean> {
        if (!confirm('There may be unsaved changes, do you still want to continue?')) return false

        const { data, filePath } = await eapi.loadProject(p)
        if (!data || !filePath) return false
        StorageM.setProject(data)
        StorageM.setCurrentFilePath(filePath)
        return true
    },

    async saveProject() {
        const filePath = await eapi.saveProject(await getProjectToSave())
        if (!filePath) return
        StorageM.setCurrentFilePath(filePath)
    },

    async getTempSvg() {
        let tempSvg = await await eapi.getTempSvg()
        if (!tempSvg) {
            if (StorageM.getCurrentFilePath())
                await eapi.loadProject({ filePath: StorageM.getCurrentFilePath() })
            else await eapi.createProject({ doImportSvg: false })
        }
        tempSvg = await await eapi.getTempSvg()
        return tempSvg
    }
}

async function getProjectToSave(): Promise<saveProjectParams> {
    const project = StorageM.getProject()
    const lastTime = AnimM.currentTime
    await AnimM.selectTime(0, SvElM.svEl)
    project.svgFile = svgEl()?.outerHTML
    await AnimM.selectTime(lastTime, SvElM.svEl)
    return {
        data: project,
        filePath: StorageM.getCurrentFilePath(),
    }
}

// async function isProjectUnsaved() {
//     const a = await getProjectToSave()
//     const b = await eapi.loadProject({ filePath: StorageM.getCurrentFilePath() })
//     console.log(a, b)
// }

// isProjectUnsaved()