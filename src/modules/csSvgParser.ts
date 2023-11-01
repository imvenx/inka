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

        let x = (el.style as any).x
        if (x) {
            x = parseFloat(x.replace('px', '')).toFixed(3)
            el.setAttribute('x', x)
            this.lastValue[el.id].x = x
        }

        let y = (el.style as any).y
        if (y) {
            y = parseFloat(y.replace('px', '')).toFixed(3)
            el.setAttribute('y', y)
            this.lastValue[el.id].y = y
        }

        let width: any = el.style.width
        if (width) {
            width = parseFloat(width.replace('px', '')).toFixed(3)
            el.setAttribute('width', width)
            this.lastValue[el.id].width = width + 'px'
        }

        let height: any = el.style.height
        if (height) {
            height = parseFloat(height.replace('px', '')).toFixed(3)
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
            if (d) attrs.push({ key: 'd', val: d })
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

            // console.log(prop.val, this.lastValue[elId]?.[prop.key])
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

    private static colorKeywordToRGB(color: string) {

        if (!color) return ''
        if (color.includes('rgb') || color.includes('#')) return color

        // CREATE TEMPORARY ELEMENT
        let el = document.createElement('div');

        // APPLY COLOR TO TEMPORARY ELEMENT
        el.style.color = color;

        // APPEND TEMPORARY ELEMENT
        document.body.appendChild(el);

        // RESOLVE COLOR AS RGB() VALUE
        let rgbValue = window.getComputedStyle(el).color;

        // REMOVE TEMPORARY ELEMENT
        document.body.removeChild(el);

        return rgbValue;
    }

    private static arcToBezier(
        x1: number,
        y1: number,
        rx: number,
        ry: number,
        angle: number,
        largeArcFlag: number,
        sweepFlag: number,
        x2: number,
        y2: number,
    ): any {
        // convert angle to radians
        angle = angle * (Math.PI / 180);

        // calculate needed values for conversion
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const dx = (x1 - x2) / 2;
        const dy = (y1 - y2) / 2;
        const x1p = cosAngle * dx + sinAngle * dy;
        const y1p = -sinAngle * dx + cosAngle * dy;
        let rxSq = rx * rx;
        let rySq = ry * ry;
        const x1pSq = x1p * x1p;
        const y1pSq = y1p * y1p;

        // calculate radius correction factor
        let radiiCorrectionFactorSq = (x1pSq / rxSq) + (y1pSq / rySq);
        if (radiiCorrectionFactorSq > 1) {
            const radiiCorrectionFactor = Math.sqrt(radiiCorrectionFactorSq);
            rx *= radiiCorrectionFactor;
            ry *= radiiCorrectionFactor;
            rxSq = rx * rx;
            rySq = ry * ry;
        }

        // calculate center point
        let sign = (largeArcFlag === sweepFlag) ? -1 : 1;
        let sq = (
            ((rxSq * rySq) - (rxSq * y1pSq) - (rySq * x1pSq)) /
            ((rxSq * y1pSq) + (rySq * x1pSq))
        );
        sq < 0 && (sq = 0);
        const coef = sign * Math.sqrt(sq);
        const cxp = coef * ((rx * y1p) / ry);
        const cyp = coef * (-(ry * x1p) / rx);
        const cx = cosAngle * cxp - sinAngle * cyp + ((x1 + x2) / 2);
        const cy = sinAngle * cxp + cosAngle * cyp + ((y1 + y2) / 2);

        // calculate start and end angle
        const ux = (x1p - cxp) / rx;
        const uy = (y1p - cyp) / ry;
        const vx = (-x1p - cxp) / rx;
        const vy = (-y1p - cyp) / ry;
        let startAngle = (uy >= 0) ? Math.acos(ux) : 2 * Math.PI - Math.acos(ux);
        let endAngle = (vy >= 0) ? Math.acos(vx) : 2 * Math.PI - Math.acos(vx);

        // make sure end angle is greater than start angle
        if (sweepFlag === 0 && endAngle > startAngle) {
            endAngle -= 2 * Math.PI;
        } else if (sweepFlag === 1 && endAngle < startAngle) {
            endAngle += 2 * Math.PI;
        }

        // calculate bezier control points
        const arcLength = Math.abs(endAngle - startAngle);
        const segments = Math.ceil(arcLength / (Math.PI / 2));
        const theta = arcLength / segments
    }



    static convertToCubicBezier(pathElement: any): string {

        const d = pathElement.getAttribute('d')
        // return `path("${d}")`

        // if (
        //     !d.includes('L')
        //     && !d.includes('H')
        //     && !d.includes('V')
        // ) {
        //     return `path("${d}")`
        // }


        const pathData = pathElement.getPathData()
        let bezier = '', x: number, y: number, firstX: number, firstY: number, lastX: number, lastY: number

        pathData.forEach((n: { type: string, values: number[] }) => {

            // switch (n.type) {

            //     case 'L':
            //         bezier += `C ${n.values[0]},${n.values[1]} ${n.values[0]},${n.values[1]} ${n.values[0]},${n.values[1]} `
            //         lastX = n.values[0]
            //         lastY = n.values[1]
            //         break

            //     case 'H':
            //         bezier += `C ${lastX},${lastY} ${lastX},${lastY} ${n.values[0]},${lastY} `
            //         lastX = n.values[0]
            //         break

            //     case 'V':
            //         bezier += `C ${lastX},${lastY} ${lastX},${lastY} ${lastX},${n.values[0]} `
            //         lastY = n.values[0]
            //         break

            //     case 'M':
            //         bezier += `M ${n.values[0]} ${n.values[1]} `
            //         lastX = n.values[0]
            //         lastY = n.values[1]
            //         break

            //     case 'C':
            //         bezier += `C ${n.values[0]},${n.values[1]} ${n.values[2]},${n.values[3]} ${n.values[4]},${n.values[5]} `
            //         break

            //     case 'Z':
            //         bezier += 'Z '
            //         break
            // }

            n.values.forEach((v, i) => n.values[i] = parseFloat(v.toFixed(3)))

            // const x1 = n?.values[2]
            // const y1 = n?.values[3]
            // const x2 = n?.values[4]
            // const y2 = n?.values[5]

            switch (n.type) {

                case 'L':
                    x = n.values[0]
                    y = n.values[1]
                    bezier += `C ${(lastX + ((x - lastX) * 0.33)).toFixed(3)},${(lastY + ((y - lastY) * 0.33)).toFixed(3)} ${(lastX + ((x - lastX) * 0.66)).toFixed(3)},${(lastY + ((y - lastY) * 0.66)).toFixed(3)} ${x},${y} `
                    // bezier += `C ${(lastX + ((x - lastX) * 0.33)).toFixed(3)},${(lastY + ((y - lastY) * 0.33)).toFixed(3)} ${((lastX + ((x - lastX) * 0.66)).toFixed(3))},${(lastY + ((y - lastY) * 0.66)).toFixed(3)} ${x},${y} `
                    lastX = x
                    lastY = y
                    break

                case 'H':
                    x = n.values[0]
                    bezier += `C ${(lastX + ((x - lastX) * 0.33)).toFixed(3)},${lastY} ${((lastX + ((x - lastX) * 0.66)).toFixed(3))},${lastY} ${x},${lastY} `
                    lastX = x
                    break

                case 'V':
                    y = n.values[0]
                    bezier += `C ${lastX},${(lastY + ((y - lastY) * 0.33)).toFixed(3)} ${lastX},${(lastY + ((y - lastY) * 0.66)).toFixed(3)} ${lastX},${y} `
                    lastY = y
                    break

                case 'M':
                    bezier += `M ${n.values[0]} ${n.values[1]} `
                    firstX = n.values[0]
                    firstY = n.values[1]
                    lastX = n.values[0]
                    lastY = n.values[1]
                    break

                case 'C':
                    bezier += `C ${n.values[0]},${n.values[1]} ${n.values[2]},${n.values[3]} ${n.values[4]},${n.values[5]} `
                    lastX = n.values[4]
                    lastY = n.values[5]
                    break

                case 'Z':
                    x = firstX
                    y = firstY
                    bezier += `C ${(lastX + ((x - lastX) * 0.33)).toFixed(3)},${(lastY + ((y - lastY) * 0.33)).toFixed(3)} ${(lastX + ((x - lastX) * 0.66)).toFixed(3)},${(lastY + ((y - lastY) * 0.66)).toFixed(3)} ${x},${y} `
                    bezier += 'Z '
                    break

                case 'A':

                    alert("path to curve don't work for arcs")
                    // x = firstX
                    // y = firstY
                    // const v = n.values
                    // console.log('on arc', v, lastX, lastY)
                    // const res = this.arcToCubicCurves(lastX, lastY, v[0], v[1], v[2], v[3], v[4], v[5], v[6], [])
                    // console.log('res', res)
                    break
            }
        })

        // console.log(d)
        // console.log(bezier)
        // return `path("${d}")`

        return `path("${bezier}")`
    }

    private static arcToCubicCurves(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        r1: number,
        r2: number,
        angle: number,
        largeArcFlag: number,
        sweepFlag: number,
        _recursive: any): any {

        let degToRad = function (degrees: number) {
            return (Math.PI * degrees) / 180;
        };

        let rotate = function (x: number, y: number, angleRad: number) {
            let X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
            let Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
            return { x: X, y: Y };
        };

        let angleRad = degToRad(angle);
        let params = [];
        let f1, f2, cx, cy;

        if (_recursive) {
            f1 = _recursive[0];
            f2 = _recursive[1];
            cx = _recursive[2];
            cy = _recursive[3];
        }
        else {
            let p1 = rotate(x1, y1, -angleRad);
            x1 = p1.x;
            y1 = p1.y;

            let p2 = rotate(x2, y2, -angleRad);
            x2 = p2.x;
            y2 = p2.y;

            let x = (x1 - x2) / 2;
            let y = (y1 - y2) / 2;
            let h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);

            if (h > 1) {
                h = Math.sqrt(h);
                r1 = h * r1;
                r2 = h * r2;
            }

            let sign;

            if (largeArcFlag === sweepFlag) {
                sign = -1;
            }
            else {
                sign = 1;
            }

            let r1Pow = r1 * r1;
            let r2Pow = r2 * r2;

            let left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
            let right = r1Pow * y * y + r2Pow * x * x;

            let k = sign * Math.sqrt(Math.abs(left / right));

            cx = k * r1 * y / r2 + (x1 + x2) / 2;
            cy = k * -r2 * x / r1 + (y1 + y2) / 2;

            f1 = Math.asin(parseFloat(((y1 - cy) / r2).toFixed(9)));
            f2 = Math.asin(parseFloat(((y2 - cy) / r2).toFixed(9)));

            if (x1 < cx) {
                f1 = Math.PI - f1;
            }
            if (x2 < cx) {
                f2 = Math.PI - f2;
            }

            if (f1 < 0) {
                f1 = Math.PI * 2 + f1;
            }
            if (f2 < 0) {
                f2 = Math.PI * 2 + f2;
            }

            if (sweepFlag && f1 > f2) {
                f1 = f1 - Math.PI * 2;
            }
            if (!sweepFlag && f2 > f1) {
                f2 = f2 - Math.PI * 2;
            }
        }

        let df = f2 - f1;

        if (Math.abs(df) > (Math.PI * 120 / 180)) {
            let f2old = f2;
            let x2old = x2;
            let y2old = y2;

            if (sweepFlag && f2 > f1) {
                f2 = f1 + (Math.PI * 120 / 180) * (1);
            }
            else {
                f2 = f1 + (Math.PI * 120 / 180) * (-1);
            }

            x2 = cx + r1 * Math.cos(f2);
            y2 = cy + r2 * Math.sin(f2);
            params = this.arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
        }

        df = f2 - f1;

        let c1 = Math.cos(f1);
        let s1 = Math.sin(f1);
        let c2 = Math.cos(f2);
        let s2 = Math.sin(f2);
        let t = Math.tan(df / 4);
        let hx = 4 / 3 * r1 * t;
        let hy = 4 / 3 * r2 * t;

        let m1 = [x1, y1];
        let m2 = [x1 + hx * s1, y1 - hy * c1];
        let m3 = [x2 + hx * s2, y2 - hy * c2];
        let m4 = [x2, y2];

        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];

        if (_recursive) {
            return [m2, m3, m4].concat(params);
        }
        else {
            params = [m2, m3, m4].concat(params);

            let curves = [];

            for (let i = 0; i < params.length; i += 3) {
                let r1 = rotate(params[i][0], params[i][1], angleRad);
                let r2 = rotate(params[i + 1][0], params[i + 1][1], angleRad);
                let r3 = rotate(params[i + 2][0], params[i + 2][1], angleRad);
                curves.push([r1.x, r1.y, r2.x, r2.y, r3.x, r3.y]);
            }

            return curves;
        }
    };


    // private static arcToCurve(
    //     x1: number,
    //     y1: number,
    //     rx: number,
    //     ry: number,
    //     angle: number,
    //     large_arc_flag: number,
    //     sweep_flag: number,
    //     x2: number,
    //     y2: number,
    //     recursive: boolean = false) {
    //     // for more information of where this math came from visit:
    //     // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes

    //     let PI = Math.PI
    //     var _120 = PI * 120 / 180,
    //         rad = PI / 180 * (+angle || 0),
    //         res = [],
    //         xy,
    //         rotate = cacher(function (x, y, rad) {
    //             var X = x * math.cos(rad) - y * math.sin(rad),
    //                 Y = x * math.sin(rad) + y * math.cos(rad);
    //             return { x: X, y: Y };
    //         });
    //     if (!recursive) {
    //         xy = rotate(x1, y1, -rad);
    //         x1 = xy.x;
    //         y1 = xy.y;
    //         xy = rotate(x2, y2, -rad);
    //         x2 = xy.x;
    //         y2 = xy.y;
    //         var cos = math.cos(PI / 180 * angle),
    //             sin = math.sin(PI / 180 * angle),
    //             x = (x1 - x2) / 2,
    //             y = (y1 - y2) / 2;
    //         var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    //         if (h > 1) {
    //             h = math.sqrt(h);
    //             rx = h * rx;
    //             ry = h * ry;
    //         }
    //         var rx2 = rx * rx,
    //             ry2 = ry * ry,
    //             k = (large_arc_flag == sweep_flag ? -1 : 1) *
    //                 math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
    //             cx = k * rx * y / ry + (x1 + x2) / 2,
    //             cy = k * -ry * x / rx + (y1 + y2) / 2,
    //             f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
    //             f2 = math.asin(((y2 - cy) / ry).toFixed(9));

    //         f1 = x1 < cx ? PI - f1 : f1;
    //         f2 = x2 < cx ? PI - f2 : f2;
    //         f1 < 0 && (f1 = PI * 2 + f1);
    //         f2 < 0 && (f2 = PI * 2 + f2);
    //         if (sweep_flag && f1 > f2) {
    //             f1 = f1 - PI * 2;
    //         }
    //         if (!sweep_flag && f2 > f1) {
    //             f2 = f2 - PI * 2;
    //         }
    //     } else {
    //         f1 = recursive[0];
    //         f2 = recursive[1];
    //         cx = recursive[2];
    //         cy = recursive[3];
    //     }
    //     var df = f2 - f1;
    //     if (abs(df) > _120) {
    //         var f2old = f2,
    //             x2old = x2,
    //             y2old = y2;
    //         f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    //         x2 = cx + rx * math.cos(f2);
    //         y2 = cy + ry * math.sin(f2);
    //         res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    //     }
    //     df = f2 - f1;
    //     var c1 = math.cos(f1),
    //         s1 = math.sin(f1),
    //         c2 = math.cos(f2),
    //         s2 = math.sin(f2),
    //         t = math.tan(df / 4),
    //         hx = 4 / 3 * rx * t,
    //         hy = 4 / 3 * ry * t,
    //         m1 = [x1, y1],
    //         m2 = [x1 + hx * s1, y1 - hy * c1],
    //         m3 = [x2 + hx * s2, y2 - hy * c2],
    //         m4 = [x2, y2];
    //     m2[0] = 2 * m1[0] - m2[0];
    //     m2[1] = 2 * m1[1] - m2[1];
    //     if (recursive) {
    //         return [m2, m3, m4][concat](res);
    //     } else {
    //         res = [m2, m3, m4][concat](res).join()[split](",");
    //         var newres = [];
    //         for (var i = 0, ii = res.length; i < ii; i++) {
    //             newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
    //         }
    //         return newres;
    //     }
    // }

    // private static cacher(f:any, scope:any, postprocessor:any):any {
    //     function newf():any {
    //         var arg = Array.prototype.slice.call(arguments, 0),
    //             args = arg.join("\u2400"),
    //             cache = newf.cache = newf.cache || {},
    //             count = newf.count = newf.count || [];
    //         if (cache[has](args)) {
    //             repush(count, args);
    //             return postprocessor ? postprocessor(cache[args]) : cache[args];
    //         }
    //         count.length >= 1e3 && delete cache[count.shift()];
    //         count.push(args);
    //         cache[args] = f[apply](scope, arg);
    //         return postprocessor ? postprocessor(cache[args]) : cache[args];
    //     }
    //     return newf;
    // }
}

