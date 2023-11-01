import { addPathDataPolyfill } from "src/polyfills/pathData"
import { eapi } from "./eapi_m"
import { svgIO } from "./svgIO_m"

export async function initInkaApp() {

    addPathDataPolyfill()

    await eapi.updatedSvg(async () => await svgIO.input())
}