import { eapi } from "./eapi_m"
import { svgIO } from "./svgIO_m"

export async function initInkaApp() {
    await eapi.updatedSvg(async () => await svgIO.input())
}