import { ref, watch } from "vue"
import { StorageM } from "./storage_m"
import { Vector2 } from "../models/Vector2"
import { svgIO } from "./svgIO_m"
import { eapi } from "./eapi_m"

const _editorScroll = ref<Vector2>(StorageM.getEditorScroll())

const _filePath = ref<string>(StorageM.getFilePath())
// watch(_filePath, () => StorageM.setFilePath(_filePath.value))

const _inDebugMode = ref(true)

const _projectId = ref(StorageM.getCurrentProjectId() ?? `id_${Date.now()}`)

export const ConfigM = {
    get editorScroll() { return _editorScroll.value },
    set editorScroll(v: Vector2) { _editorScroll.value = v },
    initEditorScroll(cont: HTMLElement) { _initEditorScroll(cont) },

    get filePath() { return _filePath.value },
    set filePath(v: string) {
        _filePath.value = v
        StorageM.setFilePath(v)
    },
    async importFile() {
        ConfigM.newProjectId()
        ConfigM.filePath = await eapi.updateFilePath()
        await svgIO.input()
    },
    async loadProject(id: string, filePath: string) {
        this.projectId = id
        this.filePath = await eapi.updateFilePath(filePath)
        await svgIO.input()
    },

    get inDebugMode() { return _inDebugMode.value },
    set inDebugMode(v: boolean) { _inDebugMode.value = v },

    get projectId() { return _projectId.value },
    set projectId(v: string) {
        _projectId.value = v
        StorageM.setCurrentProjectId(this.projectId)
    },
    newProjectId(): void { this.projectId = `id_${Date.now()}` },
}

function _initEditorScroll(cont: HTMLElement) {
    cont.scrollTo({ top: ConfigM.editorScroll.y })
    cont.scrollTo({ left: ConfigM.editorScroll.x })
    cont.addEventListener("scroll", () => {
        ConfigM.editorScroll.y = cont.scrollTop ?? 0
        ConfigM.editorScroll.x = cont.scrollLeft ?? 0
    })

    watch(() => _editorScroll.value, (val) => {
        cont?.scrollTo({ top: val.y })
        cont?.scrollTo({ left: val.x })
        StorageM.setEditorScroll(_editorScroll.value)
    }, { deep: true })
}