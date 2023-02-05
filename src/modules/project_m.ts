import { createProjectParams, loadProjectParams, saveProjectParams } from "app/public/sharedModels"
import { AnimM, svgEl } from "./anim_m"
import { eapi } from "./eapi_m"
import { StorageM } from "./storage_m"
import { SvElM } from "./svel_m"

// let _hasUnsavedChanges = false

export abstract class ProjectM {
    // get hasUnsavedChanges() { return _hasUnsavedChanges },
    // set hasUnsavedChanges(v: boolean) { _hasUnsavedChanges = v },

    static async createProject(params: createProjectParams): Promise<boolean> {
        // if (!this.hasUnsavedChanges) {
        if (!confirm('There may be unsaved changes, do you still want to continue?'))
            return false
        // }
        const success = await eapi.createProject(params)
        if (success) StorageM.clearProject()
        return success
    }


    static async openSvgWithInkscape() { eapi.openSvgWithInkscape() }
    static async openSvgWithDefaultProgram() { eapi.openSvgWithDefaultProgram() }

    static async loadProject(p?: loadProjectParams): Promise<boolean> {
        if (!confirm('There may be unsaved changes, do you still want to continue?')) return false

        const { data, filePath } = await eapi.loadProject(p)
        if (!data || !filePath) return false
        StorageM.setProject(data)
        StorageM.setCurrentFilePath(filePath)
        return true
    }

    static async saveProject() {
        try {
            const filePath = await eapi.saveProject(await this.getProjectToSave())

            if (!filePath) return

            StorageM.setCurrentFilePath(filePath)
        } catch (e) {
            console.log(e)
            alert('Error trying to save press [ctrl] + [shift] + [i] to see the full error log on the console')
        }
    }

    static async getTempSvg(): Promise<string> {
        let tempSvg = await eapi.getTempSvg()
        if (!tempSvg) {
            if (StorageM.getCurrentFilePath()) await this.updateTempSvg()
            // await eapi.loadProject({ filePath: StorageM.getCurrentFilePath() })
            else await eapi.createProject({ doImportSvg: false })
        }
        tempSvg = await eapi.getTempSvg()
        return tempSvg
    }

    static async updateTempSvg(_svg: string | undefined = undefined) {
        const svg = _svg ?? StorageM.getProject().svgFile
        await eapi.updateTempSvg({ data: svg })
    }

    private static async getProjectToSave(): Promise<saveProjectParams> {
        const project = StorageM.getProject()
        const lastTime = AnimM.currentTimeSeconds
        await AnimM.selectTime(0, SvElM.rootSvEl)
        project.svgFile = svgEl()?.outerHTML
        await AnimM.selectTime(lastTime, SvElM.rootSvEl)
        return {
            data: project,
            filePath: StorageM.getCurrentFilePath(),
        }
    }
}



// async function isProjectUnsaved() {
//     const a = await getProjectToSave()
//     const b = await eapi.loadProject({ filePath: StorageM.getCurrentFilePath() })
//     console.log(a, b)
// }

// isProjectUnsaved()