import { allowedEls } from "src/modules/constants"
import { SvEl } from "src/models/models"
import { ref } from "vue"
import { StorageM } from "./storage_m"
import { CsSvgParser } from "./csSvgParser"

export abstract class SvElM {
    private static _svgString = ref('')
    public static get svgString() { return this._svgString.value }
    public static set svgString(value) { this._svgString.value = value }

    // public static lastRootSvEl = ref<SvEl>({} as SvEl)

    private static _rootSvEl = ref<SvEl>({} as SvEl)
    // public static get rootSvElRef() { return this._rootSvEl }
    public static get rootSvElRef() { return this._rootSvEl }
    public static get rootSvEl() { return this._rootSvEl.value }
    public static set rootSvEl(value) { this._rootSvEl.value = value }

    // Warnig: Returned element has no reactivity 
    static async getSvElById(svEl: SvEl, id: string): Promise<SvEl | void> {
        if (svEl.id == id) { return svEl }
        let result
        for (let i = 0; result == null && i < svEl.children?.length!; i++)
            if (svEl.children && svEl.children.length > 0) {
                const child = svEl.children[i]
                if (child) result = await this.getSvElById(child, id)
                if (result) return result
            }
    }

    // static async updateAttrs(svEl: SvEl, el: Element) {
    //     svEl.attrs = SvElM.getAttrsArray(el)
    // }

    static async getSvEls(el: Element): Promise<SvEl> {
        let _svEl: SvEl = {} as SvEl
        const uncollapsed = StorageM.getUncollapsed()
        const showAttrs = StorageM.getShowAttrs()
        // const isSelected = StorageM.getIsSelected()

        return await this.getSvElsLoop(el, 0, _svEl, uncollapsed, showAttrs)
    }

    static async getSvElsLoop(el: Element, depth: number = 0, _svEl: SvEl, uncollapsed: any, showAttrs: any): Promise<SvEl> {

        let children: SvEl[] = []
        Array.from(el.children)?.forEach(async (child) =>
            allowedEls.includes(child.tagName) ? children.push(await this.getSvElsLoop(child, depth + 1, _svEl, uncollapsed, showAttrs)) : '')

        _svEl = {
            attrs: await CsSvgParser.getAttrsFromInkscapeToInka(el as SVGElement),
            children: children,
            id: el.id,
            // isSelected: isSelected[el.id] ?? true,
            isUncollapsed: uncollapsed[el.id],
            showAttrs: showAttrs[el.id],
            name: el.getAttribute('inkscape:label') ?? el.id,
            tagName: el.tagName,
            depth: depth,
            kfs: StorageM.getKfs(el.id),
        }
        return _svEl
    }
}