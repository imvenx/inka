import { createProjectParams, loadProjectParams } from "app/public/sharedModels"
import { ref } from "vue"
import { svgEl } from "./anim_m"
import { ConfigM } from "./config_m"
import { eapi } from "./eapi_m"
import { StorageM } from "./storage_m"
import { svgIO } from "./svgIO_m"

const saved = false
// const _filePath = ref<string>(StorageM.getCurrentFilePath())

export const ProjectM = {
    async createProject(params: createProjectParams): Promise<boolean> {
        if (!saved) {
            if (!confirm('There are unsaved changes that will be lost, do you still want to continue?'))
                return false
        }
        const success = await eapi.createProject(params)
        if (success) StorageM.clearProject()
        return success
    },

    async openProjectInInkscape() { eapi.openProjectInInkscape() },


    async loadProject(p?: loadProjectParams): Promise<boolean> {
        const { data, filePath } = await eapi.loadProject(p)
        if (!data || !filePath) return false
        StorageM.setProject(data)
        StorageM.setCurrentFilePath(filePath)
        return true
    },

    async saveProject() {
        const data = StorageM.getProject()
        data.svgFile = svgEl()?.outerHTML
        const filePath = await eapi.saveProject({
            filePath: StorageM.getCurrentFilePath(),
            data: data
        })
        if (!filePath) return
        StorageM.setCurrentFilePath(filePath)
    },

    // get filePath() { return _filePath.value },
    // set filePath(v: string) {
    //     _filePath.value = v
    //     StorageM.setCurrentFilePath(v)
    // },
}