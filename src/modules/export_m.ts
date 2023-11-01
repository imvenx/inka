import { allowedAttrs, allowedEls } from "src/modules/constants"
import { SvEl } from "src/models/models"
import { AnimM, svgEl } from "./anim_m"
import { eapi } from "./eapi_m"
import { SvElM } from "./svel_m"
import { kebabize } from "./utils"

export abstract class ExportM {
    static async exportToSvg(): Promise<void> {
        let _svgEl = svgEl()
        // const lastTime = AnimM.currentTimeMiliseconds
        // await AnimM.selectTime(0, SvElM.rootSvEl)
        if (!_svgEl) { alert("Internal Error, svgEl is null"); return }


        let clone = _svgEl.cloneNode(true) as HTMLElement
        clone.innerHTML += this.getExportAnimString()
        await eapi.exportSvg(clone.outerHTML)
        // await AnimM.selectTime(lastTime, SvElM.rootSvEl)
    }


    static getExportAnimString() {
        let _svgEl = svgEl()
        if (!_svgEl) { alert("Internal Error, svgEl is null"); return }
        let clone = _svgEl.cloneNode(true) as HTMLElement
        let animStr = this.getExportAnimStringBase(SvElM.rootSvEl)

        clone.innerHTML += `
<style> ${animStr}
   
    #svg5 *{
        transform-box: fill-box;
        transform-origin: center;
    }
</style>`

        return clone.outerHTML
    }
    private static getExportAnimStringBase(el: SvEl) {
        let res = ''

        el.children?.forEach((child: SvEl) => res += this.getExportAnimStringBase(child))
        if (allowedEls.includes(el.tagName) && el.id) {

            let kfsStr = ` 
    @keyframes myanim${el.id} { 
        `
            res += ` 
    #${el.id} { 
        animation-name: myanim${el.id};
        animation-duration: ${AnimM.durationSeconds}s; 
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    `
            el.kfs.map(kf => {
                kfsStr += `${(kf?.offset ?? 0) * 100}% {`
                el.attrs?.forEach(attr => {
                    if (allowedAttrs.includes(attr.key) && kf[attr.key]) {
                        kfsStr += `
            ${kebabize(attr.key)}: ${kf[attr.key]};`
                    }
                })
                kfsStr += `
        }
        `
            })
            res += ` ${kfsStr} 
    }
    `
        }
        return res
    }
}
