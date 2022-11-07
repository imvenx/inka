import { allowedAttrs, allowedEls } from "src/modules/constants";
import { SvEl } from "src/models/models";
import { offset } from "./anim_m";
import { StorageM } from "./storage_m";

export async function createKeyFrame(el: SvEl): Promise<any> {
    // try {
    el.children?.forEach(async (child) => await createKeyFrame(child));
    if (!allowedEls.includes(el.tagName)) return

    let kf = el?.kfs?.find(x => x?.offset === offset.value);
    if (kf) {
        el.kfs[el.kfs.indexOf(kf)] = await attrsToKfs(document.getElementById(el.id) ?? {} as any);
    }
    else el?.kfs?.push(await attrsToKfs(document.getElementById(el.id) ?? {} as any));

    el?.kfs?.sort((a: any, b: any) => a?.offset - b?.offset);
    StorageM.setKfs(el.id, el.kfs)

    // } catch (e) { console.log('Error trying to create kf on el:', el, e) }

    async function attrsToKfs(el: Element) {
        let r1: any = {}

        // try {
        el?.getAttributeNames().forEach((attr: any) => {
            if (allowedAttrs.includes(attr)) {
                if (el.tagName === 'svg') { }
                else if (attr === 'x' || attr === 'y') {
                    const _attr = el?.getAttribute(attr)
                    if (!_attr?.includes('px')) r1[attr] = `${_attr}px`
                    else r1[attr] = _attr
                }
                else if (attr === 'width' || attr === 'height') {
                    r1[attr] = el?.getAttribute(attr) + 'px';
                }
                else if (attr === 'style') {
                    const styles = el.getAttribute(attr)?.split(';');
                    styles?.forEach(styleStr => {
                        const style = styleStr.split(':');
                        r1[style[0]] = style[1];
                    });
                }
                else if (attr === 'transform') {
                    // console.log(el.getAttribute(attr))
                    // r1['transform-origin'] = 'center'
                    // transform-box: fill-box;
                    // transform-origin: center;
                    // r1[attr] = el.getAttribute(attr)?.replace(')', 'deg)')
                    const m = (el as any).transform.baseVal.consolidate().matrix;
                    r1[attr] = `matrix(
                ${m.a.toFixed(5)},
                ${m.b.toFixed(5)},
                ${m.c.toFixed(5)},
                ${m.d.toFixed(5)},
                ${m.e.toFixed(5)},
                ${m.f.toFixed(5)})`;
                }
                else if (attr === 'd') {
                    r1[attr] = `path("${el?.getAttribute(attr)}")`;
                }
                else if (attr.includes('sodipodi:')) { }

                // else if (attr === 'stdDeviation') console.log(attr)
                else r1[attr] = el?.getAttribute(attr);

                r1['offset'] = offset.value;
            }
        });
        return r1;
        // } catch { console.log('Error on trying to get attr to kf on el:', el) }
    }
}

export function deleteKf() {

}