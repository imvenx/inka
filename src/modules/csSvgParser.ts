import { KeyVal } from "src/models/models"
import { roundToDecimals } from "./utils"

export abstract class CsSvgParser {

    /*********
     * We update attributes because when we animate and then apply styles to get a new
     * state, it only applies css styles, so we need to update the duplicated styles as attributes
     * so inkscape can render them properly, since inkscape only uses styles for some attributes
     * like fill, stroke etc, but not for x, y, width, etc
     */
    static async updateAttrsFromInkaToInkscape(el: SVGElement): Promise<void> {

        if (el.tagName === 'svg') return

        let x = (el.style as any).x?.replace('px', '')
        if (x) el.setAttribute('x', x)

        let y = (el.style as any).y?.replace('px', '')
        if (y) el.setAttribute('y', y)

        if (el.tagName === 'rect' || el.tagName === 'ellipse') {
            let rx = (el.style as any).rx
            if (rx) el.setAttribute('rx', rx)
            let ry = (el.style as any).ry
            if (ry) el.setAttribute('ry', ry)
        }

        let width = el.style.width?.replace('px', '')
        if (width) el.setAttribute('width', width)

        let height = el.style.height?.replace('px', '')
        if (height) el.setAttribute('height', height)

        let d = (el.style as any).d
        if (d) {
            d = d.replace('path("', '').replace('")', '');
            el.setAttribute('d', d);
            (el.style as any).d = ''
        }

        let transform = el.style.transform

        if (transform.includes('translate')) {
            el.setAttribute('transform', transform.replaceAll('px', ''))
        }

        if (transform.includes('rotate')) {
            const bbox = (el as SVGGraphicsElement).getBBox()

            const oX = bbox.x + bbox.width / 2
            const oY = bbox.y + bbox.height / 2

            el.setAttribute('transform',
                `rotate(${el.style.transform
                    .replace('rotate(', '')
                    .replace('deg)', '')
                },${oX.toFixed(3)}, ${oY.toFixed(3)})`
            )

            // if (transform.includes('matrix')) {
            //     const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            //     const m = baseVal.matrix

            //     if (m) {
            //         el.setAttribute('transform'
            //             , `(${m.a.toFixed(5),
            //             m.b.toFixed(5),
            //             m.c.toFixed(5),
            //             m.d.toFixed(5),
            //             m.e.toFixed(5),
            //             m.f.toFixed(5)})`
            //         )
            //     }
            // }
        }
    }

    /**
     * Get attributes from inkscape svg format to a css friendly format
     */
    static getAttrsFromInkscapeToInka(el: SVGElement): KeyVal[] {

        if (el.tagName === 'svg') return []

        let attrs: KeyVal[] = []

        // TODO: compare with last state, return if not modified, focus on hierarcy if modified
        // const lastEl = await SvElM.getSvElById(SvElM.lastSvEl.value, el.id)

        const x = (el.style as any).x || el.getAttribute('x')
        if (x) {
            el.setAttribute('x', x)
            attrs.push({ key: 'x', val: x })
        }

        const y = (el.style as any).y || el.getAttribute('y')
        if (y) {
            el.setAttribute('y', y)
            attrs.push({ key: 'y', val: y })
        }

        if (el.tagName === 'rect' || el.tagName === 'ellipse') {

            const rx = (el.style as any).rx || el.getAttribute('rx')
            if (rx) {
                el.setAttribute('rx', rx)
                attrs.push({ key: 'rx', val: rx })
            }
            const ry = (el.style as any).ry || el.getAttribute('ry')
            if (ry) {
                el.setAttribute('ry', ry)
                attrs.push({ key: 'ry', val: ry })
            }
        }

        let width = el.style.width || el.getAttribute('width')
        if (width) {
            width.includes('px') ? '' : width += 'px'
            el.setAttribute('width', width)
            attrs.push({ key: 'width', val: width })
        }

        let height = el.style.height || el.getAttribute('height')
        if (height) {
            height.includes('px') ? '' : height += 'px'
            el.setAttribute('height', height)
            attrs.push({ key: 'height', val: height })
        }

        const style = el.style
        if (style) {
            const fill = style.fill
            if (fill) { attrs.push({ key: 'fill', val: fill }) }

            const stroke = style.stroke
            if (stroke) { attrs.push({ key: 'stroke', val: stroke }) }

            const strokeWidth = style.strokeWidth
            if (strokeWidth) { attrs.push({ key: 'strokeWidth', val: strokeWidth }) }

            const strokeDasharray = style.strokeDasharray
            if (strokeDasharray) { attrs.push({ key: 'strokeDasharray', val: strokeDasharray }) }

            const strokeLinecap = style.strokeLinecap
            if (strokeLinecap) { attrs.push({ key: 'strokeLinecap', val: strokeLinecap }) }
        }

        const transform = el.getAttribute('transform')
        if (!transform) {
            if (el.tagName === 'g') {
                attrs.push({ key: 'transform', val: 'none' })
            }
        }
        else {
            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            const m = baseVal.matrix

            if (transform.includes('translate')) {
                const v = `translate(${m.e.toFixed(3) ?? 0}px, ${m.f.toFixed(3) ?? 0}px)`
                attrs.push({
                    key: 'transform',
                    val: v
                })
                el.style.transform = v
            }

            else if (transform.includes('rotate')) {
                const v = `rotate(${roundToDecimals(1, baseVal.angle)}deg)`
                attrs.push({
                    key: 'transform',
                    val: v
                })
                el.style.transform = v
            }

            // else if (baseVal && transform.includes('matrix')) {
            //     const matrix =
            //         `matrix(${m.a.toFixed(5)},
            //         ${m.b.toFixed(5)},
            //         ${m.c.toFixed(5)},
            //         ${m.d.toFixed(5)},
            //         ${m.e.toFixed(5)},
            //         ${m.f.toFixed(5)})`
            //     attrs.push({
            //         key: 'transform',
            //         val: matrix
            //     })
            // }

        }

        if (el.tagName === 'path') {
            const d = `path('${el.getAttribute('d')}')`
            attrs.push({ key: 'd', val: d })
        }


        // names.forEach(name => {
        //     if (allowedAttrs.includes(name)) {
        //         // if (name === 'style') attrs = attrs.concat(this.separateStyleAttrs(el))
        //         // else 
        //         attrs.push({ key: name, val: el.getAttribute(name) ?? '' })
        //     }
        // })

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