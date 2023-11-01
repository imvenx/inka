import { computed, ref, watch } from "vue"
import { StorageM } from "./storage_m"
import { Vector2 } from "../models/Vector2"
import { AnimM } from "./anim_m"

export abstract class ConfigM {

    private static _timePickerLinePos = computed<number>(() =>
        (Math.round(AnimM.currentTimeSeconds * ConfigM.numDecimals * ConfigM.zoomPx + this.timeSideOffsetPx)))

    private static _numDecimals = 10
    private static _zoomPx = ref(StorageM.getZoomPxTimePicker() ?? 80)

    private static _editorScroll = ref<Vector2>(StorageM.getEditorScroll())
    static get editorScroll() { return this._editorScroll.value }
    static set editorScroll(v: Vector2) { this._editorScroll.value = v }

    // private static _convertPathsToBezierCurve = StorageM

    private static _rowHeight = 19.19
    static get rowHeight() {
        return this._rowHeight
    }
    static set rowHeight(value) {
        this._rowHeight = value
    }

    private static _timeSideOffsetPx = 15
    public static get timeSideOffsetPx() {
        return ConfigM._timeSideOffsetPx
    }
    public static set timeSideOffsetPx(value) {
        ConfigM._timeSideOffsetPx = value
    }

    static timePickerWidth = computed(() => AnimM.durationSeconds * ConfigM.numDecimals * ConfigM.zoomPx
        + (this.timeSideOffsetPx * 2))


    private static _inDebugMode = ref(true)

    // private static _projectId = ref(StorageM.getCurrentProjectId() ?? `id_${Date.now()}`)
    private static _projectName = ref(StorageM.getProjectName() ?? `new_project`)

    private static _timePickerZoom = ref(1)

    static initEditorScroll(cont: HTMLElement) {
        cont.scrollTo({ left: ConfigM.editorScroll.x })
        setTimeout(() => {
            cont.scrollTop = ConfigM.editorScroll.y
            cont.addEventListener("scroll", () => {
                ConfigM.editorScroll.x = cont.scrollLeft ?? 0
                ConfigM.editorScroll.y = cont.scrollTop ?? 0
            })
        }, 100);

        watch(() => this._editorScroll.value, (val) => {
            cont?.scrollTo({ top: val.y })
            cont?.scrollTo({ left: val.x })
            StorageM.setEditorScroll(this._editorScroll.value)
        }, { deep: true })
    }

    // async loadProject(id: string, filePath: string) {
    //     this.projectId = id
    //     // this.filePath = await eapi.updateFilePath(filePath)
    //     await svgIO.input()
    // },

    static get inDebugMode() { return this._inDebugMode.value }
    static set inDebugMode(v: boolean) { this._inDebugMode.value = v }

    static get numDecimals() { return this._numDecimals }

    // get projectId() { return _projectId.value },
    // set projectId(v: string) {
    //     _projectId.value = v
    //     StorageM.setCurrentProjectId(this.projectId)
    // },
    static get projectName() { return this._projectName.value }
    static set projectName(v: string) {
        this._projectName.value = v
        StorageM.setProjectName(this.projectName)
    }
    // newProjectId(): void { this.projectId = `id_${Date.now()}` },

    static get timePickerZoom() { return this._timePickerZoom.value }
    static set timePickerZoom(v: number) { this._timePickerZoom.value = v }

    static get timePickerLinePos() { return this._timePickerLinePos.value }
    // set timePickerZoom(v: number) { this._timePickerZoom.value = v },

    static get zoomPx() { return this._zoomPx.value }
    static set zoomPx(v: number) { this._zoomPx.value = v; StorageM.setZoomPxTimePicker(v) }

}