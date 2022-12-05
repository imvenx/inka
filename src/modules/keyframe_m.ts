import { allowedAttrs, allowedEls } from "src/modules/constants"
import { SvEl } from "src/models/models"
import { StorageM } from "./storage_m"
import { AnimM } from "./anim_m"
import { ref } from "vue"
import { SvElM } from "./svel_m"


export abstract class KfsM {

    // const _selectedKfs = ref<Keyframe[]>()

    static _showKfMenu = ref(false)
    static get showKfMenu() { return this._showKfMenu.value }
    static set showKfMenu(v: boolean) { this._showKfMenu.value = v }

    static async updateKf(el: SvEl, offset: number, newOffset: number) {
        if (offset === null || offset === undefined) {
            console.log('csSvg: error offset undefined')
            return
        }

        el.children?.forEach(async (child) => await this.updateKf(child, offset, newOffset));
        if (!allowedEls.includes(el.tagName)) return

        const kfToEdit = el.kfs.find(x => x.offset === offset)
        if (!kfToEdit) return
        if (newOffset < 0) newOffset = 0
        if (newOffset > 1) newOffset = 1
        kfToEdit.offset = newOffset

        window.addEventListener('mouseup', async () => {
            el?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset);
            StorageM.setKfs(el.id, el.kfs)
            await AnimM.refreshAnim(el)
        }, { once: true })
    }

    static async selectKf() {

    }

    static async unselectKf() {

    }

    static async unselectAllKfs() {

    }

    static async createKeyFrame(svEl: SvEl): Promise<any> {

        // console.log(
        //     document.getElementById('rect556')?.attributes.x
        // )
        // return
        svEl.children?.forEach(async (child) => await this.createKeyFrame(child));
        if (!allowedEls.includes(svEl.tagName) || this.elHasNotAllowedAttrs(svEl)) return

        const el = document.getElementById(svEl.id)
        if (!el) return

        let kf = svEl?.kfs?.find(x => x?.offset === AnimM.currentTimeSeconds / AnimM.durationSeconds)
        const kfs = await this.attrsToKfs(el)
        if (!kfs) return
        if (kf) svEl.kfs[svEl.kfs.indexOf(kf)] = kfs
        else svEl?.kfs?.push(kfs)

        svEl?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset)
        StorageM.setKfs(svEl.id, svEl.kfs)

    }

    static async updateKfs(elId: string, kf: Keyframe[]) {
        StorageM.setKfs(elId, kf)
    }

    static async deleteKf(el: SvEl, offset: number | null | undefined) {

        if (offset === null || offset === undefined) {
            console.log('csSvg: error offset undefined'); return
        }

        el.children?.forEach(async (child) => await this.deleteKf(child, offset));
        if (!allowedEls.includes(el.tagName)) return

        // TODO: delete instead of filter, because this is leaving {} empty objects on the file
        el.kfs = el.kfs.filter(x => x.offset !== offset)
        StorageM.setKfs(el.id, el.kfs)

        await AnimM.refreshAnim(SvElM.rootSvEl)
    }

    // TODO: check why this is being called twice, and fix it
    private static async attrsToKfs(el: Element) {
        let r1: any = {}

        el?.getAttributeNames().forEach((attr: any) => {
            if (allowedAttrs.includes(attr)) {

                if (el.tagName === 'svg') { }
                else if (attr === 'x' || attr === 'y') {
                    const val = el?.getAttribute(attr)
                    if (val) {
                        if (!val?.includes('px')) r1[attr] = `${val}px`
                        else r1[attr] = val
                    }
                }
                else if (attr === 'width' || attr === 'height') {
                    const val = el?.getAttribute(attr)
                    if (val) r1[attr] = val + 'px'
                }
                else if (attr === 'style') {
                    const styles = el.getAttribute(attr)?.split(';')
                    styles?.forEach(styleStr => {
                        if (styleStr) {
                            const style = styleStr.replaceAll(' ', '').split(':')
                            if (allowedAttrs.includes(style[0])) r1[style[0]] = style[1];
                        }
                    })
                }
                else if (attr === 'transform') {
                    // console.log(el.getAttribute(attr))
                    // r1['transform-origin'] = 'center'
                    // transform-box: fill-box;
                    // transform-origin: center;
                    // r1[attr] = el.getAttribute(attr)?.replace(')', 'deg)')
                    const m = (el as any).transform.baseVal.consolidate().matrix
                    r1[attr] = `matrix(
            ${m.a.toFixed(5)},
            ${m.b.toFixed(5)},
            ${m.c.toFixed(5)},
            ${m.d.toFixed(5)},
            ${m.e.toFixed(5)},
            ${m.f.toFixed(5)})`
                }
                else if (attr === 'd') {
                    r1[attr] = `path("${el?.getAttribute(attr)}")`
                }
                else if (attr.includes('sodipodi:')) { }

                // else if (attr === 'stdDeviation') console.log(attr)
                else r1[attr] = el?.getAttribute(attr)

                // r1['offset'] = offset.value;
                r1['offset'] = AnimM.currentTimeSeconds / AnimM.durationSeconds;
            }
        })
        return r1
    }

    private static elHasNotAllowedAttrs(el: SvEl): boolean {
        return el?.attrs.filter(v => allowedAttrs.includes(v.key)).length <= 0
    }

}










