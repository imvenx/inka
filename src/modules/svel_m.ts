import { allowedAttrs, allowedEls } from "src/modules/constants"
import { SvEl, KeyVal } from "src/models/models"
import { ref } from "vue"
import { StorageM } from "./storage_m"

export abstract class SvElM {
    private static _svgString = ref('')
    public static get svgString() { return this._svgString.value }
    public static set svgString(value) { this._svgString.value = value }

    private static _rootSvEl = ref<SvEl>({} as SvEl)
    public static get rootSvEl() { return this._rootSvEl.value }
    public static set rootSvEl(value) { this._rootSvEl.value = value }

    static async getSvElById(svEl: SvEl, id: string): Promise<SvEl | void> {
        if (!allowedEls.includes(svEl.tagName)) return
        if (svEl.id === id) return svEl
        svEl.children?.forEach(async (child) => await this.getSvElById(child, svEl.id))
    }

    static async getSvEls(el: Element): Promise<SvEl> {
        let _svEl: SvEl
        const uncollapsed = StorageM.getUncollapsed()
        const showAttrs = StorageM.getShowAttrs()

        function getSvElsLoop(el: Element, i: number = 0): SvEl {

            let children: SvEl[] = []
            Array.from(el.children)?.forEach(child =>
                allowedEls.includes(child.tagName) ?
                    children.push(getSvElsLoop(child, i + 1)) : '')

            _svEl = {
                attrs: SvElM.getAttrsArray(el),
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

    static getAttrsArray(el: Element): KeyVal[] {
        const names = el.getAttributeNames()
        let attrs: KeyVal[] = []
        names.forEach(name => {
            if (allowedAttrs.includes(name)) {
                if (name === 'style') attrs = attrs.concat(this.separateStyleAttrs(el))
                else attrs.push({ key: name, val: el.getAttribute(name) ?? '' })
            }
        })
        return attrs
    }
    static separateStyleAttrs(el: Element): KeyVal[] {
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
} 