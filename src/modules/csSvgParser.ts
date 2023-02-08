import { KeyVal } from "src/models/models"
import { AnimM } from "./anim_m"
import { KfsM } from "./kfs_m"
import { SvElM } from "./svel_m"
import { roundToDecimals } from "./utils"

export abstract class CsSvgParser {

    private static lastValue: any = {}

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

        let width = el.style.width?.replace('px', '')
        if (width) el.setAttribute('width', width)

        let height = el.style.height?.replace('px', '')
        if (height) el.setAttribute('height', height)

        if (el.tagName === 'rect' || el.tagName === 'ellipse') {
            let rx = (el.style as any).rx
            if (rx) el.setAttribute('rx', rx)
            let ry = (el.style as any).ry
            if (ry) el.setAttribute('ry', ry)
        }


        let d = (el.style as any).d
        const lastD = d
        if (d) {
            d = d.replace('path("', '').replace('")', '')
            el.setAttribute('d', d)

                ; (el.style as any).d = ''
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

        this.lastValue[el.id] = {
            x: parseFloat(x).toFixed(3),
            y: parseFloat(y).toFixed(3),
            width: parseFloat(width).toFixed(3)?.replaceAll('px', '') + 'px',
            height: parseFloat(height).toFixed(3)?.replaceAll('px', '') + 'px',
            d: lastD,
            fill: this.colorKeywordToRGB(el.style.fill),
            fillOpacity: el.style.fillOpacity,
            stroke: this.colorKeywordToRGB(el.style.stroke),
            strokeWidth: el.style.strokeWidth,
            strokeDasharray: el.style.strokeDasharray,
            strokeLinecap: el.style.strokeLinecap,
        }

    }

    /**
    * Get attributes from inkscape svg format to a css-friendly-animable format
    */
    static async getAttrsFromInkscapeToInka(el: SVGElement): Promise<KeyVal[]> {

        if (el.id === 'layer1') return []

        if (el.tagName === 'svg') return [
            { key: 'fill', val: this.colorKeywordToRGB(el.style.fill) },
            // { key: 'width', val: el.getAttribute('width')! },
            // { key: 'height', val: el.getAttribute('height')! },
        ]

        let attrs: KeyVal[] = []

        // TODO: compare with last state, return if not modified, focus on hierarcy if modified
        // const lastEl = await SvElM.getSvElById(SvElM.lastSvEl.value, el.id)

        let x: any, y, width, height, style, transform

        if (el.tagName !== 'path') {
            x = parseFloat((el.style as any).x || el.getAttribute('x')).toFixed(3)
            y = parseFloat((el.style as any).y || el.getAttribute('y')).toFixed(3)
            width = parseFloat(el.style.width as any || el.getAttribute('width')).toFixed(3)
            height = parseFloat(el.style.height as any || el.getAttribute('height')).toFixed(3)
        }
        style = el.style
        transform = el.getAttribute('transform')


        if (x) {
            el.setAttribute('x', x)
            attrs.push({ key: 'x', val: x })
        }

        if (y) {
            el.setAttribute('y', y)
            attrs.push({ key: 'y', val: y })
        }

        if (width) {
            width.includes('px') ? '' : width += 'px'
            el.setAttribute('width', width)
            attrs.push({ key: 'width', val: width })
        }

        if (height) {
            height.includes('px') ? '' : height += 'px'
            el.setAttribute('height', height)
            attrs.push({ key: 'height', val: height })
        }

        if (style) {
            const fill = this.colorKeywordToRGB(style.fill)
            if (fill) { attrs.push({ key: 'fill', val: fill }) }

            const fillOpacity = style.fillOpacity
            if (fillOpacity) { attrs.push({ key: 'fillOpacity', val: fillOpacity }) }

            const stroke = style.stroke
            if (stroke) { attrs.push({ key: 'stroke', val: this.colorKeywordToRGB(stroke) }) }

            const strokeWidth = style.strokeWidth
            if (strokeWidth) { attrs.push({ key: 'strokeWidth', val: strokeWidth }) }

            const strokeDasharray = style.strokeDasharray
            if (strokeDasharray) { attrs.push({ key: 'strokeDasharray', val: strokeDasharray }) }

            const strokeLinecap = style.strokeLinecap
            if (strokeLinecap) { attrs.push({ key: 'strokeLinecap', val: strokeLinecap }) }
        }

        if (!transform) {
            if (el.tagName === 'g') {
                attrs.push({ key: 'transform', val: 'none' })
            }
        }
        else {
            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            const m = baseVal.matrix

            if (transform.includes('translate')) {

                console.log(el.id, m.e.toFixed(3))

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

        const d = `path("${el.getAttribute('d')}")`
        if (el.tagName === 'path') {
            attrs.push({ key: 'd', val: d })
        }

        // names.forEach(name => {
        //     if (allowedAttrs.includes(name)) {
        //         // if (name === 'style') attrs = attrs.concat(this.separateStyleAttrs(el))
        //         // else 
        //         attrs.push({ key: name, val: el.getAttribute(name) ?? '' })
        //     }
        // })

        if (AnimM.isRecording) {
            await this.ifValueChangedRecord(el.id, [
                { key: 'x', val: x },
                { key: 'y', val: y },
                { key: 'width', val: width?.replaceAll('px', '') + 'px' },
                { key: 'height', val: height?.replaceAll('px', '') + 'px' },
                { key: 'd', val: d },
                { key: 'fill', val: this.colorKeywordToRGB(style.fill) },
                { key: 'fillOpacity', val: style.fillOpacity },
                { key: 'stroke', val: this.colorKeywordToRGB(style.stroke) },
                { key: 'strokeWidth', val: style.strokeWidth },
                { key: 'strokeDasharray', val: style.strokeDasharray },
                { key: 'strokeLinecap', val: style.strokeLinecap },
            ])
        }
        this.lastValue[el.id] = {
            x: x,
            y: y,
            width: width?.replaceAll('px', '') + 'px',
            height: height?.replaceAll('px', '') + 'px',
            d: d,
            fill: this.colorKeywordToRGB(style.fill),
            fillOpacity: style.fillOpacity,
            stroke: this.colorKeywordToRGB(style.stroke),
            strokeWidth: style.strokeWidth,
            strokeDasharray: style.strokeDasharray,
            strokeLinecap: style.strokeLinecap,
        }

        return attrs
    }

    private static async ifValueChangedRecord(elId: string, props: KeyVal[]) {
        let changedProps: any = {}

        props.forEach(prop => {
            if (
                prop.val &&
                !prop.val?.includes('undefined') &&
                !prop.val?.includes('null') &&
                !prop.val?.includes('NaN')
            ) {
                prop.val?.replace('px', '') != this.lastValue?.[elId]?.[prop.key]?.replace('px', '') ? changedProps[prop.key] = prop.val : ''

                // console.log('val:', prop.val, '|last val:', this.lastValue?.[elId]?.[prop.key])
            }
        })

        if (Object.keys(changedProps).length > 0) await KfsM.createKeyFrame(SvElM.rootSvEl, elId, changedProps)

        // AnimM.selectTime(AnimM.currentTimeMiliseconds += 50, SvElM.rootSvEl)
    }

    // private static separateStyleAttrs(el: Element): KeyVal[] {
    //     const stylesStr = el.getAttribute('style')
    //     const styles: KeyVal[] = []

    //     let attrs = stylesStr?.split(';')
    //     attrs?.pop()
    //     attrs?.forEach(attr => {
    //         const keyVal = attr.split(':')
    //         styles.push({ key: keyVal[0], val: keyVal[1] })
    //     })
    //     return styles
    // }

    private static colorKeywordToRGB(colorKeyword: string) {

        if (colorKeyword.includes('rgb')) return colorKeyword

        // CREATE TEMPORARY ELEMENT
        let el = document.createElement('div');

        // APPLY COLOR TO TEMPORARY ELEMENT
        el.style.color = colorKeyword;

        // APPEND TEMPORARY ELEMENT
        document.body.appendChild(el);

        // RESOLVE COLOR AS RGB() VALUE
        let rgbValue = window.getComputedStyle(el).color;

        // REMOVE TEMPORARY ELEMENT
        document.body.removeChild(el);

        return rgbValue;
    }
}