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

        if (!this.lastValue[el.id]) this.lastValue[el.id] = {}

        let x = (el.style as any).x?.replace('px', '')
        if (x) {
            x = parseFloat(x).toFixed(3)
            el.setAttribute('x', x)
            this.lastValue[el.id].x = x
        }

        let y = (el.style as any).y?.replace('px', '')
        if (y) {
            y = parseFloat(y).toFixed(3)
            el.setAttribute('y', y)
            this.lastValue[el.id].y = y
        }

        let width: any = el.style.width?.replace('px', '')
        if (width) {
            width = parseFloat(width).toFixed(3)
            el.setAttribute('width', width)
            this.lastValue[el.id].width = width + 'px'
        }

        let height: any = el.style.height?.replace('px', '')
        if (height) {
            height = parseFloat(height).toFixed(3)
            el.setAttribute('height', height)
            this.lastValue[el.id].height = height + 'px'
        }

        if (el.tagName === 'rect' || el.tagName === 'ellipse') {
            let rx = (el.style as any).rx
            if (rx) {
                el.setAttribute('rx', rx)
                this.lastValue[el.id].rx = rx
            }
            let ry = (el.style as any).ry
            if (ry) {
                el.setAttribute('ry', ry)
                this.lastValue[el.id].ry = ry
            }
        }

        if (el.tagName === 'path') {
            let d = (el.style as any).d
            if (d) {
                this.lastValue[el.id].d = d
                d = d.replace('path("', '').replace('")', '')
                el.setAttribute('d', d)
                    ; (el.style as any).d = ''
            }
        }

        let transform = el.style.transform

        if (transform.includes('translate')) {

            const t = transform.replaceAll('px', '')
            el.setAttribute('transform', t)

            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            const m = baseVal.matrix
            const v = `translate(${m.e.toFixed(3) ?? 0}px, ${m.f.toFixed(3) ?? 0}px)`
            this.lastValue[el.id].transform = v
        }

        if (transform.includes('rotate')) {

            const bbox = (el as SVGGraphicsElement).getBBox()

            const oX = bbox.x + bbox.width / 2
            const oY = bbox.y + bbox.height / 2

            const t = `rotate(${el.style.transform
                .replace('rotate(', '')
                .replace('deg)', '')
                },${oX.toFixed(3)}, ${oY.toFixed(3)})`

            el.setAttribute('transform', t)
            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            const v = `rotate(${roundToDecimals(1, baseVal.angle)}deg)`

            this.lastValue[el.id].transform = v
            // console.log(t, v)

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

        this.lastValue[el.id].fill = this.colorKeywordToRGB(el.style.fill)
        this.lastValue[el.id].fillOpacity = el.style.fillOpacity
        this.lastValue[el.id].stroke = this.colorKeywordToRGB(el.style.stroke)
        this.lastValue[el.id].strokeWidth = el.style.strokeWidth
        this.lastValue[el.id].strokeDasharray = el.style.strokeDasharray
        this.lastValue[el.id].strokeLinecap = el.style.strokeLinecap
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
            x = parseFloat((el.style as any).x || el.getAttribute('x')) as any
            y = parseFloat((el.style as any).y || el.getAttribute('y')) as any
            width = parseFloat(el.style.width as any || el.getAttribute('width')) as any
            height = parseFloat(el.style.height as any || el.getAttribute('height')) as any

            Number.isNaN(x) ? x = '' : x = x.toFixed(3)
            Number.isNaN(y) ? y = '' : y = y.toFixed(3)
            Number.isNaN(width) ? width = '' : width = width.toFixed(3)
            Number.isNaN(height) ? height = '' : height = height.toFixed(3)
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
                attrs.push({ key: 'transform', val: 'rotate(0deg)' })
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

        if (el.tagName === 'path') {
            let d = this.convertToCubicBezier(el)
            if (d) {
                attrs.push({ key: 'd', val: d })
            }
        }

        if (AnimM.isRecording) {
            await this.ifValueChangedRecord(el.id, attrs)
        }

        if (!this.lastValue[el.id]) this.lastValue[el.id] = {}
        attrs.map(attr => this.lastValue[el.id][attr.key] = attr.val)

        return attrs
    }

    private static async ifValueChangedRecord(elId: string, props: KeyVal[]) {
        let changedProps: any = {}

        props.forEach(prop => {
            prop.val != this.lastValue?.[elId]?.[prop.key] ? changedProps[prop.key] = prop.val : ''

            if (prop.key == 'transform')
                console.log(prop.val, this.lastValue[elId]?.[prop.key])
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

    static convertToCubicBezier(pathElement: any): string {

        const d = pathElement.getAttribute('d')
        if (
            !d.includes('L')
            && !d.includes('H')
            && !d.includes('V')
        ) {
            return `path("${d}")`
        }

        const pathData = pathElement.getPathData()
        let bezier = '', lastX = '', lastY = ''

        pathData.forEach((n: { type: string, values: string[] }) => {

            switch (n.type) {

                case 'L':
                    bezier += `C ${n.values[0]},${n.values[1]} ${n.values[0]},${n.values[1]} ${n.values[0]},${n.values[1]} `
                    lastX = n.values[0]
                    lastY = n.values[1]
                    break

                case 'H':
                    bezier += `C ${lastX},${lastY} ${lastX},${lastY} ${n.values[0]},${lastY} `
                    lastX = n.values[0]
                    break

                case 'V':
                    bezier += `C ${lastX},${lastY} ${lastX},${lastY} ${lastX},${n.values[0]} `
                    lastY = n.values[0]
                    break

                case 'M':
                    bezier += `M ${n.values[0]} ${n.values[1]} `
                    lastX = n.values[0]
                    lastY = n.values[1]
                    break

                case 'C':
                    bezier += `C ${n.values[0]},${n.values[1]} ${n.values[2]},${n.values[3]} ${n.values[4]},${n.values[5]} `
                    break

                case 'Z':
                    bezier += 'Z '
                    break
            }
        });

        return `path("${bezier}")`
    }




}

