import { ref } from "vue"
import { AnimM, svgEl } from "./anim_m"
import { ProjectM } from "./project_m"
import { StorageM } from "./storage_m"
import { SvElM } from "./svel_m"

export abstract class svgIO {

    private static outputTimeout = {} as any

    private static _refreshInkscape = ref(true)
    public static get refreshInkscape() {
        return svgIO._refreshInkscape.value
    }
    public static set refreshInkscape(value: boolean) {
        svgIO._refreshInkscape.value = value
    }

    static async input(): Promise<void> {
        let svgData = await ProjectM.getTempSvg()

        const svgContainer = document.createElement('div')
        svgContainer.innerHTML = svgData

        SvElM.svgString = svgData
    }

    static async output(): Promise<void> {

        if (!this.refreshInkscape) return

        clearTimeout(this.outputTimeout)

        this.outputTimeout = setTimeout(async () => {

            const svg = svgEl()?.cloneNode(true) as Element
            if (!svg) return

            ProjectM.updateTempSvg(svg.outerHTML)

            if (!AnimM.isRecording) SvElM.rootSvEl = await SvElM.getSvEls(svgEl()!)

            StorageM.setCurrentTimeSeconds(AnimM.currentTimeSeconds)

        }, 50)

    }

    // TODO: use abortController on updateTempSvg on project handler instead of timeout on frontend
    static clearOutputTimeout() { clearTimeout(this.outputTimeout) }

}
