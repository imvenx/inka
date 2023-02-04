import { exec } from "child_process";
import electron, { dialog } from "electron";
import { promises as p, } from "fs"
import path from "path"
import { mainWindow } from "../electron-main";

export abstract class inkscapeH {

  private static configRootPath = path.join(electron.app.getPath('userData'), 'inkaConfig.json')

  static async getInkscapePath() {
    let inkscapePath = ''
    try {
      inkscapePath = JSON.parse(await (p.readFile(this.configRootPath, 'utf-8') as any)).inkscapePath
      if (inkscapePath) return inkscapePath

      inkscapePath = await this.askInkscapePath()
    }
    catch { inkscapePath = await this.askInkscapePath() }
    return inkscapePath
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

  static async refreshInkscapeUI() {
    exec(`${await inkscapeH.getInkscapePath()} -q --actions="file-rebase"`, (e1, { }, stderr) => {
      // if (stderr) console.log('stderr: ', stderr)
      if (e1) {
        exec(`gdbus call --session --dest org.inkscape.Inkscape --object-path /org/inkscape/Inkscape/window/1 --method org.gtk.Actions.Activate document-revert [] {}`,
          (e2, { }, stderr) => {
            if (e2) console.log('error: ', e2)
            // if (stderr) console.log('stderr: ', stderr)
          })
        console.log('error: ', e1)
      }
    })
  }

  static async resetInkscapePath() {
    await this.askInkscapePath()
  }

  private static async setInkscapePath(path: string) {
    let _config
    try { _config = JSON.parse(await p.readFile(this.configRootPath, 'utf-8') as any) }
    catch { _config = {} as any }
    const config = _config
    config.inkscapePath = path
    await p.writeFile(this.configRootPath, JSON.stringify(config), { encoding: 'utf-8' })
  }
}