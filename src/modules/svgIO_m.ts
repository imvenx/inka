import { AnimM, svgEl } from "./anim_m"
import { eapi } from "./eapi_m"
import { ProjectM } from "./project_m"
import { StorageM } from "./storage_m"
import { SvElM } from "./svel_m"


export abstract class svgIO {
    private static outputTimeout = {} as any

    static async input(): Promise<void> {

        let svgData = await ProjectM.getTempSvg()

        const svgContainer = document.createElement('div')
        svgContainer.innerHTML = svgData
        let svg = svgContainer.children[0] as SVGElement

        // svg?.removeChild(svg.getElementsByTagName('sodipodi:namedview')[0])

        const _svEl = await SvElM.getSvEls(svg)
        SvElM.svgString = svgData
        SvElM.rootSvEl = _svEl
    }
    static async output(): Promise<void> {
        clearTimeout(this.outputTimeout)
        this.outputTimeout = setTimeout(async () => {
            const svg = svgEl()?.cloneNode(true) as Element
            if (!svg) return

            // let newFile = (await cssvgParser.cssStylesToSvgAttributes(
            //     svg.cloneNode(true) as Element))?.outerHTML

            await eapi.updateTempSvg({ data: svg.outerHTML })
            // svg?.removeChild(svg.getElementsByTagName('sodipodi:namedview')[0])

            // console.log(svg.children[1].children[0].attributes.x)
            SvElM.rootSvEl = await SvElM.getSvEls(svg)
            // cssvgParser.removeStyles(svg)
            StorageM.setCurrentTimeSeconds(AnimM.currentTimeSeconds)
        }, 50)

    }

    // TODO: use abortController on updateTempSvg on project handler instead of timeout on frontend
    static clearOutputTimeout() { clearTimeout(this.outputTimeout) }


}
