import { AnimM, svgEl } from "./anim_m"
import { allowedEls } from "./constants"
import { eapi } from "./eapi_m"
import { ProjectM } from "./project_m"
import { SvElM } from "./svel_m"

let outputTimeout = {} as any

export const svgIO = {
    async input(): Promise<void> {

        let svgData = await ProjectM.getTempSvg()

        const svgContainer = document.createElement('div')
        svgContainer.innerHTML = svgData
        let svg = svgContainer.children[0] as SVGElement

        svg.removeChild(svg.getElementsByTagName('sodipodi:namedview')[0])

        const _svEl = await SvElM.getSvEls(svg)
        SvElM.svgString = svgData
        SvElM.rootSvEl = _svEl
    },
    async output(): Promise<void> {
        clearTimeout(outputTimeout)
        outputTimeout = setTimeout(async () => {
            const svg = svgEl()?.cloneNode(true) as Element
            if (!svg) return

            let newFile = (await cssStylesToSvgAttributes(svg))?.outerHTML
            await eapi.updateTempSvg({ data: newFile })
            svg.removeChild(svg.getElementsByTagName('sodipodi:namedview')[0])

            // console.log(svg.children[1].children[0].attributes.x)
            SvElM.rootSvEl = await SvElM.getSvEls(svg)
        }, 50)

    },

    // TODO: use abortController on updateTempSvg on project handler instead of timeout on frontend
    clearOutputTimeout() { clearTimeout(outputTimeout) }
}

export async function cssStylesToSvgAttributes(_el: Element): Promise<Element> {
    // let el = _el as any
    const el = document.getElementById(_el.id) as any

    await Array.from(el.children)
        .forEach(async (child) => await cssStylesToSvgAttributes(child as Element))

    if (!allowedEls.includes(el.tagName)) return el

    let x = el.style.x
    if (x) {
        el.setAttribute('x', x);
        // el.style.x = ''
    }

    let y = el.style.y
    if (y) {
        el.setAttribute('y', y);
        // el.style.y = ''
    }

    let width = el.style.width
    if (width) {
        if (el.tagName !== 'svg') el.setAttribute('width', width.replace('px', ''));
        // el.style.width = ''
    }

    let height = el.style.height
    if (height) {
        if (el.tagName !== 'svg') el.setAttribute('height', height.replace('px', ''));
        // el.style.height = ''
    }

    let transform = el.style.transform
    if (transform) {
        el.setAttribute('transform', transform);
        // el.style.transform = ''
    }

    let d = el.style.d
    if (d) {
        d = d.replace('path("', '').replace('")', '');
        el.setAttribute('d', d)
        el.style.d = ''
    }

    return el
}