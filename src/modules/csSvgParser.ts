import { L } from "app/dist/electron/UnPackaged/assets/index.8edcfc3a"
import { KeyVal } from "src/models/models"
import { svgEl } from "./anim_m"
import { performanceTest } from "./utils"

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
    static async updateAttrs(el: HTMLElement) {
        let x = (el.style as any).x?.replace('px', '')
        if (x) {
            el.setAttribute('x', x)
            // el.style.x = ''
        }

        let y = (el.style as any).y?.replace('px', '')
        if (y) {
            el.setAttribute('y', y)
        }
        // el.style.y = ''

        let width = el.style.width?.replace('px', '')
        let height = el.style.width?.replace('px', '')


        let transform = el.style.transform
        if (transform) {
            // el.setAttribute('transform', transform.replaceAll('px', '')
            //     .replaceAll('deg', ''))

            if (transform.includes('rotate')) {
                // const baseVal: SVGTransform = (el as any).transform.baseVal[0]
                // const m = baseVal.matrix

                // const svgCR = svgEl()!.getBoundingClientRect()
                // const cR = el.getBoundingClientRect()
                // const bbox = (el as any).getBBox()
                // const x = Math.round((bbox.width / 2))
                // const y = Math.round((bbox.height / 2))

                // if (m) {
                // el.setAttribute('transform'
                //     , `(${m.a.toFixed(5),
                //     m.b.toFixed(5),
                //     m.c.toFixed(5),
                //     m.d.toFixed(5),
                //     m.e.toFixed(5),
                //     m.f.toFixed(5)})`
                // )
                // el.setAttribute('x', '100')
                // el.setAttribute('y', '50')
                const cRect = el.getBoundingClientRect()
                const a = (cRect.width + cRect.left) / 2
                const b = (cRect.height + cRect.top) / 2

                const f = (parseInt(x) + a).toFixed(3)
                const g = (parseInt(y) + b).toFixed(3)
                console.log(x, y, a, b, f, g)

                el.setAttribute('transform',
                    `rotate(${el.style.transform
                        .replace('rotate(', '')
                        .replace('deg)', '')
                    })`
                )
                // }
            }
            // el.style.transformOrigin = 'unset'
            // el.style.transformBox = 'fill-box'
        }
    }

    /**
     * Get attributes from inkscape svg format to a css friendly format
     */
    static getAttrs(el: SVGElement): KeyVal[] {
        // const names = el.getAttributeNames()
        let attrs: KeyVal[] = []

        if (el.tagName === 'svg') return []
        // if (el.tagName === 'g') return []

        // if( el instanceof SVGGeometryElement){        }

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
        }

        // const transform = el.transform.baseVal[0]
        const transform = el.getAttribute('transform')
        if (transform) {
            const baseVal: SVGTransform = (el as any).transform.baseVal[0]
            // console.log(baseVal)
            // const m = baseVal.matrix
            // console.log(baseVal)
            // if (m) {
            // if (transform.includes('translate')) {
            //     attrs.push({
            //         key: 'transform',
            //         val: `translate(${m.e}px, ${m.f}px)`
            //     })
            // }

            if (baseVal && transform.includes('rotate')) {
                // console.log((transform));

                attrs.push({
                    key: 'transform',
                    val: `rotate(${Math.round(baseVal.angle)}deg)`
                })
            }
            // }
            // attrs.push({ key: 'transform', val: transform })
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