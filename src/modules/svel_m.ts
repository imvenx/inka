import { allowedAttrs, allowedEls } from "src/modules/constants"
import { SvEl, KeyVal } from "src/models/models"
import { ref } from "vue"
import { StorageM } from "./storage_m"

//#region SvEl
export const svgString = ref('')
export const svEl = ref<SvEl>({} as SvEl)

export function getSvEls(el: Element): SvEl {
    let _svEl: SvEl
    const uncollapsed = StorageM.getUncollapsed()
    const showAttrs = StorageM.getShowAttrs()

    function getSvElsLoop(el: Element, i: number = 0): SvEl {

        let children: SvEl[] = []
        Array.from(el.children)?.forEach(child =>
             allowedEls.includes(child.tagName) ? 
            children.push(getSvElsLoop(child, i + 1) ) : '')
            
        _svEl = {
            attrs: getAttrsArray(el),
            children: children,
            id: el.id,
            isUncollapsed: uncollapsed[el.id],
            showAttrs: showAttrs[el.id],
            name: el.getAttribute('inkscape:label') ?? el.id,
            tagName: el.tagName,
            depth: i,
            kfs: StorageM.getKfs(el.id),
        }
        return _svEl
    }
    return getSvElsLoop(el)
}
function getAttrsArray(el: Element): KeyVal[] {
    const names = el.getAttributeNames()
    let attrs: KeyVal[] = []
    names.forEach(name => {
        if(allowedAttrs.includes(name)){
            if (name === 'style') attrs = attrs.concat(separateStyleAttrs(el))
            else attrs.push({ key: name, val: el.getAttribute(name) ?? '' })
        }
    })
    return attrs
}
function separateStyleAttrs(el: Element): KeyVal[] {
    const stylesStr = el.getAttribute('style')
    const styles: KeyVal[] = []

    let attrs = stylesStr?.split(';')
    attrs?.pop()
    attrs?.forEach(attr => {
        const keyVal = attr.split(':')
        styles.push({ key: keyVal[0], val: keyVal[1] })
    })
    return styles
}
// export async function getSvg() {
//     const { file, _filePath } = await eapi.getSvg(filePath.value.toString()) ?? {}
//     if (!file) return
//     let _svgString = file
//     // filePath.value = _filePath

//     let svgContainer = document.createElement('div')
//     svgContainer.innerHTML = _svgString
//     let svg = svgContainer.children[0] as SVGElement

//     svg.removeChild(svg.getElementsByTagName('sodipodi:namedview')[0])
 
//     const _svEl = getSvEls(svg)
    
//      // async getSvg(): Promise<void> {
//     //   let res = await getSvg()
//     //   this.svgString = res?.svgString
//     //   if (res?.svEl) this.svEl = res?.svEl
//     // },

//     svgString.value = _svgString
//     svEl.value = _svEl

//     // return { _svgString, _svEl}
// }
    // els = Array.from(svg.children) as HTMLElement[]

    
   // svg.removeChild(svg.getElementsByTagName('defs')[0])

    // svg.removeChild(svg.query(x => x.tagName === 'inkscape:grid'), 1)
    // svg.removeChild(svg.query(x => x.tagName === 'svg'), 1)
    // console.log(svg)

  // getSvgEls(parent: HTMLElement) {
    //   this.svgEls = Array.from(parent.getElementsByTagName('*')) as SVGElement[]
    //   this.svgEls.splice(this.svgEls.findIndex(x => x.tagName === 'sodipodi:namedview'), 1)
    //   this.svgEls.splice(this.svgEls.findIndex(x => x.tagName === 'inkscape:grid'), 1)
    //   this.svgEls.splice(this.svgEls.findIndex(x => x.tagName === 'svg'), 1)
    // },

//#endregion