import { allowedAttrs, allowedEls } from "src/modules/constants"
import { SvEl } from "src/models/models"
import { AnimM, svgEl } from "./anim_m"
import { svEl } from "./svel_m"
import { eapi } from "./eapi_m"

export async function exportToSvg() {
    let _svgEl = svgEl()
    await AnimM.selectTime(0, svEl.value)
    if (!_svgEl) { alert("Internal Error, svgEl is null"); return }

    let animStr = getExportAnimString(svEl.value)
    let clone = _svgEl.cloneNode(true) as HTMLElement
    clone.innerHTML += `
<style> ${animStr} </style>`
    await eapi.exportSvg(clone.outerHTML)
}

function getExportAnimString(el: SvEl) {
    let res = ''

    el.children?.forEach((child: SvEl) => res += getExportAnimString(child))
    if (allowedEls.includes(el.tagName) && el.id) {

        let kfsStr = ` 
    @keyframes myanim${el.id} { 
        `
        res += ` 
    #${el.id} { 
        animation-name: myanim${el.id};
        animation-duration: ${AnimM.duration}s; 
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    `
        el.kfs.map(kf => {
            kfsStr += `${(kf?.offset ?? 0) * 100}% {`
            el.attrs?.forEach(attr => {
                if (allowedAttrs.includes(attr.key) && kf[attr.key]) {
                    kfsStr += `
            ${attr.key}: ${kf[attr.key]};`
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
