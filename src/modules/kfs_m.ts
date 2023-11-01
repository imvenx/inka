import { allowedAttrs, allowedEls } from "src/modules/constants"
import { KeyVal, SvEl } from "src/models/models"
import { StorageM } from "./storage_m"
import { AnimM } from "./anim_m"
import { ref } from "vue"
import { SvElM } from "./svel_m"
import { roundToDecimals } from "./utils"
import { svgIO } from "./svgIO_m"


export abstract class KfsM {

    // const _selectedKfs = ref<Keyframe[]>()

    static _showKfMenu = ref(false)
    static get showKfMenu() { return this._showKfMenu.value }
    static set showKfMenu(v: boolean) { this._showKfMenu.value = v }

    static async updateKfOffset(svEl: SvEl, offset: number, newOffset: number) {
        if (offset === null || offset === undefined) {
            console.log('csSvg: error offset undefined')
            return
        }

        svEl.children?.forEach(async (child) => await this.updateKfOffset(child, offset, newOffset));
        if (!allowedEls.includes(svEl.tagName)) return

        const kfToEdit = svEl.kfs.find(x => x.offset === offset)
        if (!kfToEdit) return
        if (newOffset < 0) newOffset = 0
        if (newOffset > 1) newOffset = 1
        kfToEdit.offset = roundToDecimals(3, newOffset)
    }

    static async refreshAndSaveKfs(_svEl: SvEl) {
        async function loop(svEl: SvEl) {
            svEl.children?.forEach(async (child) => await loop(child));
            if (!allowedEls.includes(svEl.tagName)) return

            svEl.kfs.sort((a: any, b: any) => a?.offset - b?.offset);
            StorageM.setKfs(svEl.id, svEl.kfs)
        }

        await loop(_svEl)
        await AnimM.refreshAnim(_svEl)
        svgIO.output()
    }

    static async createKeyFrames(svEl: SvEl): Promise<any> {

        svEl.children?.forEach(async (child) => await this.createKeyFrames(child));
        if (!allowedEls.includes(svEl.tagName) || this.elHasNotAllowedAttrs(svEl)) return

        let kf = svEl.kfs.find(x => x?.offset === AnimM.currentOffset)
        // const kfs = await this.attrsToKfs(svEl)
        let kfs: any = {}
        kfs.offset = AnimM.currentOffset
        svEl.attrs.forEach(attr => kfs[attr.key] = attr.val)

        if (!kfs) return
        if (kf) svEl.kfs[svEl.kfs.indexOf(kf)] = kfs
        else svEl.kfs.push(kfs)

        svEl?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset)
        this.updateKfs(svEl.id, svEl.kfs)
    }

    static async createKeyFrame(svEl: SvEl, elId: string, kfs: Keyframe): Promise<any> {

        if (svEl.tagName == 'svg') {
            if (!svEl.kfs.find(x => x.offset == AnimM.currentOffset)) {

                svEl.kfs.push({ offset: AnimM.currentOffset, fill: 'rgb(0,0,0,0)' })

                svEl?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset)

                this.updateKfs(svEl.id, svEl.kfs)
            }
        }

        if (svEl.id != elId) {
            svEl.children?.forEach(async (child) => await this.createKeyFrame(child, elId, kfs));
            return
        }

        // if (svEl.tagName == 'svg') return

        if (!allowedEls.includes(svEl.tagName) || this.elHasNotAllowedAttrs(svEl)) return

        kfs.offset = AnimM.currentOffset
        svEl.kfs.push(kfs)

        svEl?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset)

        this.updateKfs(elId, svEl.kfs)
    }

    static async updateKfs(id: string, kfs: Keyframe[]) {
        StorageM.setKfs(id, kfs)
    }

    static async deleteKfs(el: SvEl, offset: number | null | undefined) {
        await this.deleteKfsLoop(el, offset)
        await AnimM.refreshAnim(SvElM.rootSvEl)
    }

    static async deleteKfsLoop(el: SvEl, offset: number | null | undefined) {

        if (offset === null || offset === undefined) {
            console.log('csSvg: error offset undefined'); return
        }

        el.children?.forEach(async (child) => await this.deleteKfsLoop(child, offset));
        if (!allowedEls.includes(el.tagName)) return

        // TODO: delete instead of filter, because this is leaving {} empty objects on the file
        el.kfs = el.kfs.filter(x => x.offset !== offset)
        StorageM.setKfs(el.id, el.kfs)
    }

    static async deleteKf(el: SvEl, offset: number, kfToDeleteName: string) {

        if (offset === null || offset === undefined) {
            console.log('csSvg: error offset undefined'); return
        }

        let index = el.kfs.indexOf(el.kfs.find(x => x.offset == offset)!)
        delete el.kfs[index][kfToDeleteName]

        StorageM.setKfs(el.id, el.kfs)

        await AnimM.refreshAnim(SvElM.rootSvEl)
    }

    // private static async attrsToKfs(svEl: SvEl) {
    //     let kfs: any = {}
    //     kfs.offset = AnimM.currentOffset
    //     svEl.attrs.forEach(attr => kfs[attr.key] = attr.val)
    //     return kfs

    //     // el?.getAttributeNames().forEach((attr: any) => {
    //     //     if (allowedAttrs.includes(attr)) {

    //     // if (el.tagName === 'svg') { }
    //     // else if (attr === 'x' || attr === 'y') {
    //     //     const val = el?.getAttribute(attr)
    //     //     if (val) {
    //     //         if (!val?.includes('px')) r1[attr] = `${val}px`
    //     //         else r1[attr] = val
    //     //     }
    //     // }
    //     // else if (attr === 'width' || attr === 'height') {
    //     //     const val = el?.getAttribute(attr)
    //     //     if (val) r1[attr] = val + 'px'
    //     // }
    //     // else if (attr === 'style') {
    //     //     const styles = el.getAttribute(attr)?.split(';')
    //     //     styles?.forEach(styleStr => {
    //     //         if (styleStr) {
    //     //             const style = styleStr.replaceAll(' ', '').split(':')
    //     //             if (allowedAttrs.includes(style[0])) r1[style[0]] = style[1];
    //     //         }
    //     //     })
    //     // }
    //     // else if (attr === 'transform') {
    //     //     // console.log(el.getAttribute(attr))
    //     //     // r1['transform-origin'] = 'center'
    //     //     // transform-box: fill-box;
    //     //     // transform-origin: center;
    //     //     // r1[attr] = el.getAttribute(attr)?.replace(')', 'deg)')

    //     //     // const m = (el as any).transform.baseVal.consolidate().matrix
    //     //     // r1[attr] = `matrix(${m.a.toFixed(5)}, ${m.b.toFixed(5)}, ${m.c.toFixed(5)}, ${m.d.toFixed(5)}, ${m.e.toFixed(5)}, ${m.f.toFixed(5)})`
    //     // }
    //     //         else if (attr === 'd') {
    //     //             r1[attr] = `path("${el?.getAttribute(attr)}")`
    //     //         }
    //     //         else if (attr.includes('sodipodi:')) { }

    //     //         // else if (attr === 'stdDeviation') console.log(attr)
    //     //         else r1[attr] = el?.getAttribute(attr)

    //     //         // r1['offset'] = offset.value;
    //     //         r1['offset'] = AnimM.currentTimeSeconds / AnimM.durationSeconds;
    //     //     }
    //     // })
    //     // console.log('asd')
    //     // return r1
    // }

    private static elHasNotAllowedAttrs(el: SvEl): boolean {
        return el?.attrs.filter(v => allowedAttrs.includes(v.key)).length <= 0
    }

}