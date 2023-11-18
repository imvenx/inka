import { exec as _exec } from "child_process";
import { promisify } from "util";
const exec = promisify(_exec);
import { dialog } from "electron";
import { promises as p, existsSync } from "fs"
import { mainWindow, platform } from "../electron-main";
import { logInkaError } from "../utils/utils";
import { tempFilePath } from "./svgH";
import { ConfigH } from "./config_h";
import { InkaConfig } from "../models/InkaConfig";

export abstract class inkscapeH {

  private static inkscapePath = ''
  public static onDoking = true

  static async resetInkscapePath() {
    ConfigH.resetInkscapePath()
    inkscapeH.inkscapePath = ''
    this.openInkscapeWindow()
  }

  private static realPathApp(path: string) {
    if (platform == "linux") {
      if (path.indexOf(".AppImage") !== -1) {
        return `b=\`mount | grep \"${path.split('/').pop()}\"\`;a=\($b\);\${a[2]}/AppRun`
      }
    }
    return path
  }

  private static async getInkscapePath() {
    if (this.inkscapePath) return this.inkscapePath

    try {
      let configdata = await (p.readFile(ConfigH.configRootPath, 'utf-8') as any)
      const config: InkaConfig = JSON.parse(configdata)
      if (config.inkscapePath) {
        this.inkscapePath = config.inkscapePath
        return this.inkscapePath
      }

      this.inkscapePath = await this.askInkscapePath()
    }
    catch (e) {
      logInkaError(e, 'error on close inkscape window')
      this.inkscapePath = await this.askInkscapePath()
    }

    return this.inkscapePath
  }

  static async askInkscapePath() {
    await dialog.showMessageBox(mainWindow!, { message: 'Please select inkscape executable file' })
    const inkscapePath = (await dialog.showOpenDialog(mainWindow!,
      {
        properties: ['openFile'],
        title: 'Select inkscape path',
      })).filePaths[0]
    if (inkscapePath) await ConfigH.saveInkscapePath(inkscapePath)
    return inkscapePath
  }

  // static async refreshInkscapeUI() {
  // }

  static async reopenInkscape() {
    await this.closeInkscapeWindow()
    await this.openInkscapeWindow()
  }

  static async openInkscapeWindow() {

    const inkscapePath = await inkscapeH.getInkscapePath()
    if (!inkscapePath) return

    const configInkDir = await ConfigH.configInkDir
    if (!configInkDir) return

    try {
      let cmd = `INKSCAPE_PROFILE_DIR="${configInkDir}" "${inkscapePath}"`
      let enviroment = {}
      if (platform == "win32") {
        cmd = `"${inkscapePath}"`
        enviroment = { env: { INKSCAPE_PROFILE_DIR: configInkDir } }
      }
      await exec(
        `${cmd} "${tempFilePath()}"`, enviroment
      )
    }
    catch (e: any) {
      if (e.toString().includes('not found')) {
        await this.askInkscapePath()
        await this.openInkscapeWindow()
      }
      logInkaError(e, 'error trying to open inkscape window')
      // const newInkscapePath = await inkscapeH.askInkscapePath()
      // if (newInkscapePath) exec(`"${newInkscapePath}" ${tempFilePath()}`)
    }
  }

  // private static async setInkscapePath(path: string) {
  // let _config: InkaConfig
  // try { _config = JSON.parse(await p.readFile(ConfigH.configRootPath, 'utf-8') as any) }
  // catch { _config = {} as any }
  // const config = _config
  // config.inkscapePath = path
  // ConfigH.inkscapePath = path
  // await p.writeFile(ConfigH.configRootPath, JSON.stringify(config), { encoding: 'utf-8' })
  // }

  private static async closeInkscapeWindow() {

    const inkscapePath = await inkscapeH.getInkscapePath()
    if (!inkscapePath) return

    const configInkDir = await ConfigH.configInkDir
    if (!configInkDir) return

    try {
      let cmd = `INKSCAPE_PROFILE_DIR="${configInkDir}" "${inkscapePath}"`
      let enviroment = {}
      if (platform == "win32") {
        cmd = `"${inkscapePath}"`
        enviroment = { env: { INKSCAPE_PROFILE_DIR: configInkDir } }
      }
      await exec(
        `${cmd} -q --actions="window-close"`, enviroment
      )
    }
    catch (e) {
      logInkaError(e, 'error on close inkscape window')
    }
  }

  static async dock(x: number,y: number,width: number,height: number) {
    try {
      const configInkPREFS = await ConfigH.configInkPREFS
      if (!configInkPREFS) return
      await inkscapeH.undock()
      try {
        let geo = `<group
                  width="${width}"
                  height="${height}"
                  x="${x}"
                  y="${y}"
                  maximized="0"
                  fullscreen="0"
                  id="geometry" />`
        const wpos = await p.readFile(configInkPREFS, 'utf-8')
        let nwpos = wpos.replace(/\<group[^\>]*id="geometry"[^\>]*\>/gms,geo)
        await p.writeFile(configInkPREFS, nwpos, { encoding: 'utf-8' })
        await this.reopenInkscape()
        return true
      } catch (e) {
          console.log(e, 'Error on geting window position file')
      }
    }
    catch (e) {
      logInkaError(e, 'Error on try set config')
      return false
    }
  }

  static async undock() {
    try {
      const configInkWPOS = await ConfigH.configInkWPOS
      if (existsSync(configInkWPOS)) {
        await p.unlink(configInkWPOS);
      }
      return true
    }
    catch (e) {
      logInkaError(e, 'Error on try set config')
      return false
    }
  }

  static async profileDir() {
    try {
      if (!existsSync(ConfigH.configInkDir)) await p.mkdir(ConfigH.configInkDir)
      if (!existsSync(ConfigH.configInkDirUI)) await p.mkdir(ConfigH.configInkDirUI)
      if (!existsSync(ConfigH.configInkPREFS)) await p.copyFile(ConfigH.configInkSRCPREFS, ConfigH.configInkPREFS)
      return true
    }
    catch (e) {
      logInkaError(e, 'Error on try set profile')
      return false
    }
  }

  static async fileRebase(): Promise<void> {

    let inkscapePath = await inkscapeH.getInkscapePath()
    inkscapePath = inkscapeH.realPathApp(inkscapePath)
    //inkscapePath = `mount`
    if (!inkscapePath) return

    const configInkDir = await ConfigH.configInkDir
    if (!configInkDir) return

    try {
      let cmd = `INKSCAPE_PROFILE_DIR="${configInkDir}" ${inkscapePath}`
      let enviroment: any = { shell: "/bin/bash" }
      if (platform == "win32") {
        cmd = `"${inkscapePath}"`
        enviroment = { env: { INKSCAPE_PROFILE_DIR: configInkDir } }
      }
      await exec(
        `${cmd} -q --actions="selection-set-backup;file-rebase;selection-restore-backup;"`, enviroment
      )
    }
    catch (e) {
      logInkaError(e, 'error on file-rebase')
    }
  }

  static async documentRevert() {
    try {
      await exec(
        `gdbus call --session --dest org.inkscape.Inkscape --object-path /org/inkscape/Inkscape/window/1 --method org.gtk.Actions.Activate document-revert [] {}`
      )

      // if (stderr) logInkaError(stderr, 'stderr on document-revert')
    }
    catch (e) {
      logInkaError(e, 'error on document-revert')
    }
  }

  static async selectElement(id: string) {
    await exec(`"${ConfigH.inkscapePath()}" -q --actions="select-by-id:${id}"`)
  }

}
