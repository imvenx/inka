import { L } from "app/dist/electron/UnPackaged/assets/index.8edcfc3a"
import { KeyVal } from "src/models/models"
import { svgEl } from "./anim_m"
import { SvElM } from "./svel_m"
import { svgIO } from "./svgIO_m"
import { performanceTest, roundToDecimals } from "./utils"

export abstract class CsSvgParser {
    // static async cssStylesToSvgAttributes(_el: Element): Promise<Element> {
    //     // let el = _el as any
    //     const el = document.getElementById(_el.id) as any

    //     await Array.from(el.children)
    //         .forEach(async (child) => await this.cssStylesToSvgAttributes(child as Element))

    //     if (!allowedEls.includes(el.tagName)) return el

    //     // let x = el.style.x
    //     // if (x) {
    //     //     el.setAttribute('x', x);
    //     //     // el.style.x = ''
    //     // }

    //     // let y = el.style.y
    //     // if (y) {
    //     //     el.setAttribute('y', y);
    //     //     // el.style.y = ''
    //     // }

    //     // let width = el.style.width
    //     // if (width) {
    //     //     if (el.tagName !== 'svg') el.setAttribute('width', width.replace('px', ''));
    //     //     // el.style.width = ''
    //     // }

    //     // let height = el.style.height
    //     // if (height) {
    //     //     if (el.tagName !== 'svg') el.setAttribute('height', height.replace('px', ''));
    //     //     // el.style.height = ''
    //     // }

    //     // let transform = el.style.transform
    //     // if (transform) {
    //     //     el.setAttribute('transform', transform);
    //     //     // el.style.transform = ''
    //     // }

    //     // // let stroke = el.style.stroke
    //     // // if (stroke) {
    //     // //     el.setAttribute('stroke', stroke);
    //     // //     // el.style.stroke = ''
    //     // // }

    //     // // let fillOpacity = el.style.fillOpacity
    //     // // if (fillOpacity) {
    //     // //     el.setAttribute('fillOpacity', fillOpacity);
    //     // //     // el.style.fillOpacity = ''
    //     // // }

    //     // let d = el.style.d
    //     // if (d) {
    //     //     d = d.replace('path("', '').replace('")', '');
    //     //     el.setAttribute('d', d)
    //     //     // el.style.d = ''
    //     // }
    //     return el
    // }

    // async removeStyles(_el: Element): Promise<Element> {
    //     // let el = _el as any
    //     const el = document.getElementById(_el.id) as any

    //     await Array.from(el.children)
    //         .forEach(async (child) => await this.removeStyles(child as Element))

    //     if (!allowedEls.includes(el.tagName)) return el

    //     if (el.id === SvElM.rootSvEl.id) return el

    //     // el.style.x = ''
    //     // el.style.y = ''
    //     // el.style.width = ''
    //     // el.style.height = ''
    //     // el.style.transform = ''
    //     // el.style.d = ''

    //     // el.style = ''
    //     return el
    // }

    /*********
     * We update attributes because when we animate and then apply styles to get a new
     * state, it only applies css styles, so we need to update the duplicated styles as attributes
     * so inkscape can render them properly, since inkscape only uses styles for some attributes
     * like fill, stroke etc, but not for x, y, width, etc
     */
    static async updateAttrsFromInkaToInkscape(el: SVGElement): Promise<void> {
        let x = (el.style as any).x?.replace('px', '')
        if (x) el.setAttribute('x', x)

        let y = (el.style as any).y?.replace('px', '')
        if (y) el.setAttribute('y', y)

        let width = el.style.width?.replace('px', '')
        let height = el.style.height?.replace('px', '')

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
        // console.log(lastEl);


        // if (el.tagName === 'g') return []

        const x = (el.style as any).x || el.getAttribute('x')
        const y = (el.style as any).y || el.getAttribute('y')
        let width = el.style.width || el.getAttribute('width')
        let height = el.style.height || el.getAttribute('height')

        if (x && y && width && height) {
            // const bbox = (el as SVGGraphicsElement).getBBox()

            // const oX = parseInt(x) + parseInt(width) / 2
            // const oY = parseInt(y) + parseInt(height) / 2

            // const oX = bbox.x + bbox.width / 2
            // const oY = bbox.y + bbox.height / 2
            // console.log(oX, oY, bbox)
        }

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

        const style = el.style
        if (style) {
            const fill = style.fill
            if (fill) { attrs.push({ key: 'fill', val: fill }) }
        }

        // const transform = el.transform.baseVal[0]
        const transform = el.getAttribute('transform')
        if (!transform) {
            if (el.tagName === 'g') {
                attrs.push({ key: 'transform', val: 'rotate(0)' })
            }
        }
        else {
            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            const m = baseVal.matrix

            if (transform.includes('translate')) {
                attrs.push({
                    key: 'transform',
                    val: `translate(${m.e.toFixed(0) ?? 0}px, ${m.f.toFixed(0) ?? 0}px)`
                })
            }

            else if (transform.includes('rotate')) {
                attrs.push({
                    key: 'transform',
                    val: `rotate(${roundToDecimals(1, baseVal.angle)}deg)`
                })
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