import { computed, ref, watch } from "vue"
import { StorageM } from "./storage_m"
import { Vector2 } from "../models/Vector2"
import { AnimM } from "./anim_m"

export const timePickerWidth = computed(() => AnimM.durationSeconds * ConfigM.numDecimals * ConfigM.zoomPx
    + (timeSideOffsetPx * 2))

export const timeSideOffsetPx = 10

const _timePickerLinePos = computed<number>(() =>
    (Math.round(AnimM.currentTimeSeconds * ConfigM.numDecimals * ConfigM.zoomPx + timeSideOffsetPx)))

const _numDecimals = 10
const _zoomPx = ref(StorageM.getZoomPxTimePicker() ?? 80)

const _editorScroll = ref<Vector2>(StorageM.getEditorScroll())

const _inDebugMode = ref(true)

// const _projectId = ref(StorageM.getCurrentProjectId() ?? `id_${Date.now()}`)
const _projectName = ref(StorageM.getProjectName() ?? `new_project`)

const _timePickerZoom = ref(1)

export const rowHeight = 19.19

export const ConfigM = {
    init: () => { if (ConfigM.inDebugMode) console.log('init config module') },

    get editorScroll() { return _editorScroll.value },
    set editorScroll(v: Vector2) { _editorScroll.value = v },
    initEditorScroll(cont: HTMLElement) { _initEditorScroll(cont) },



    // async loadProject(id: string, filePath: string) {
    //     this.projectId = id
    //     // this.filePath = await eapi.updateFilePath(filePath)
    //     await svgIO.input()
    // },

    get inDebugMode() { return _inDebugMode.value },
    set inDebugMode(v: boolean) { _inDebugMode.value = v },

    get numDecimals() { return _numDecimals },

    // get projectId() { return _projectId.value },
    // set projectId(v: string) {
    //     _projectId.value = v
    //     StorageM.setCurrentProjectId(this.projectId)
    // },
    get projectName() { return _projectName.value },
    set projectName(v: string) {
        _projectName.value = v
        StorageM.setProjectName(this.projectName)
    },
    // newProjectId(): void { this.projectId = `id_${Date.now()}` },

    get timePickerZoom() { return _timePickerZoom.value },
    set timePickerZoom(v: number) { _timePickerZoom.value = v },

    get timePickerLinePos() { return _timePickerLinePos },
    // set timePickerZoom(v: number) { _timePickerZoom.value = v },

    get zoomPx() { return _zoomPx.value },
    set zoomPx(v: number) { _zoomPx.value = v; StorageM.setZoomPxTimePicker(v) },

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