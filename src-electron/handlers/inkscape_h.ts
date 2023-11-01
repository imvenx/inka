import { exec as _exec } from "child_process";
import { promisify } from "util";
const exec = promisify(_exec);
import electron, { dialog } from "electron";
import { promises as p, } from "fs"
import path from "path"
import { mainWindow } from "../electron-main";
import { logInkaError } from "../utils/utils";
import { tempFilePath } from "./svgH";

export abstract class inkscapeH {

  private static configRootPath = path.join(electron.app.getPath('userData'), 'inkaConfig.json')
  private static inkscapePath = ''

  private static async getInkscapePath() {
    if (this.inkscapePath) return this.inkscapePath

    try {
      const config = JSON.parse(await (p.readFile(this.configRootPath, 'utf-8') as any))

      if (config.inkscapePath) {
        this.inkscapePath = config.inkscapePath
        return this.inkscapePath
      }

      this.inkscapePath = await this.askInkscapePath()
    }
    catch {
      this.inkscapePath
      this.inkscapePath = await this.askInkscapePath()
    }

    return this.inkscapePath
  }

  static async askInkscapePath() {
    await dialog.showMessageBox(mainWindow!, { message: 'Please select inkscape executable file', })
    const inkscapePath = (await dialog.showOpenDialog(mainWindow!,
      {
        properties: ['openFile'],
        title: 'Select inkscape path',
      })).filePaths[0]
    if (inkscapePath) this.setInkscapePath(inkscapePath)
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

    try {
      var { stderr } = await exec(
        `"${inkscapePath}" "${tempFilePath()}"`
      )

      // if (stderr) logInkaError(stderr, 'stderr on close inkscape window')
    }
    catch (e) {
      logInkaError(e, 'error trying to close inkscape window')
      // const newInkscapePath = await inkscapeH.askInkscapePath()
      // if (newInkscapePath) exec(`"${newInkscapePath}" ${tempFilePath()}`)
    }
  }

  private static async setInkscapePath(path: string) {
    let _config
    try { _config = JSON.parse(await p.readFile(this.configRootPath, 'utf-8') as any) }
    catch { _config = {} as any }
    const config = _config
    config.inkscapePath = path
    await p.writeFile(this.configRootPath, JSON.stringify(config), { encoding: 'utf-8' })
  }

  private static async closeInkscapeWindow() {

    const inkscapePath = await inkscapeH.getInkscapePath()
    if (!inkscapePath) return

    try {
      var { stderr } = await exec(
        `"${inkscapePath}" -q --actions="window-close"`
      )

      // if (stderr) logInkaError(stderr, 'stderr on close inkscape window')
    }
    catch (e) {
      logInkaError(e, 'error on close inkscape window')
    }
  }

  static async fileRebase(): Promise<void> {

    const inkscapePath = await inkscapeH.getInkscapePath()
    if (!inkscapePath) return

    try {
      var { stderr } = await exec(`"${inkscapePath}" -q --actions="file-rebase"`)

      // if (stderr) logInkaError(stderr, 'stderr on file-rebase')
    }
    catch (e) {
      logInkaError(e, 'error on file-rebase')
    }
  }

  static async documentRevert() {
    try {
      var { stderr } = await exec(
        `gdbus call --session --dest org.inkscape.Inkscape --object-path /org/inkscape/Inkscape/window/1 --method org.gtk.Actions.Activate document-revert [] {}`
      )

      // if (stderr) logInkaError(stderr, 'stderr on document-revert')
    }
    catch (e) {
      logInkaError(e, 'error on document-revert')
    }
  }

}
