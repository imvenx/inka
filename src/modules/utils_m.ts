export function svRound(num: number): number {
    return Math.round(num * 100000) / 100000
}



// export const allowedEls = ['svg', 'path', 'rect', 'circle', 'ellipse']

// function traverseSvEl(els: SvEl[], logic: Function, params: any) {
//     els.forEach(el => {
//         if (el.children && el.children?.length > 0) traverseSvEl(el.children, logic, params)
//         logic(params)
//     })
// }

// export function getAttrsAndNames(el: Element): string {
//     let res: string = ''
//     el?.getAttributeNames().forEach((attr: any) => {
//         res += (`${attr}: ${el.getAttribute(attr)} ___ `)
//     })
//     return res
// }