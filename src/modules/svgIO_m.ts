import { AnimM, svgEl } from "./anim_m"
import { ProjectM } from "./project_m"
import { StorageM } from "./storage_m"
import { SvElM } from "./svel_m"

export abstract class svgIO {

    private static outputTimeout = {} as any

    static async input(): Promise<void> {
        let svgData = await ProjectM.getTempSvg()

        const svgContainer = document.createElement('div')
        svgContainer.innerHTML = svgData

        SvElM.svgString = svgData
    }

    static async output(): Promise<void> {
        clearTimeout(this.outputTimeout)
        this.outputTimeout = setTimeout(async () => {
            const svg = svgEl()?.cloneNode(true) as Element
            if (!svg) return

            ProjectM.updateTempSvg(svg.outerHTML)

            SvElM.rootSvEl = await SvElM.getSvEls(svgEl()!)
            StorageM.setCurrentTimeSeconds(AnimM.currentTimeSeconds)
        }, 50)

    }

    // TODO: use abortController on updateTempSvg on project handler instead of timeout on frontend
    static clearOutputTimeout() { clearTimeout(this.outputTimeout) }

}
