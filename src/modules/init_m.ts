import { useRouter } from "vue-router"
import { ConfigM } from "./config_m"
import { eapi } from "./eapi_m"
import { svgIO } from "./svgIO_m"

export async function initApp() {
    await svgIO.input()
    await eapi.updatedSvg(async () => await svgIO.input())
    // if (!ConfigM.filePath) useRouter().push('/home')
    // TODO: CHECK IF ID ALREADY EXISTS
    // ConfigM.projectId = 
}