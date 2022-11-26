import { useRouter } from "vue-router"
import { ConfigM } from "./config_m"
import { eapi } from "./eapi_m"
import { StorageM } from "./storage_m"
import { svgIO } from "./svgIO_m"

export async function initApp() {

    //#region Init Modules 
    // this is important to prevent one module load before the other and break the app
    StorageM.init()
    ConfigM.init()
    //#endregion

    await eapi.updatedSvg(async () => await svgIO.input())
}