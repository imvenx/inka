import { tmpdir } from "os"
import { inkscapeH } from "./inkscape_h";
import { promises as p, unwatchFile, watchFile, } from "fs"
import { exec } from "child_process";
import { updateTempSvgParams } from "app/public/sharedModels";
import { dialog } from "electron";
import { mainWindow } from "../electron-main";

const appPrefix = 'inka';
const tempDirectoryPath = () => `${tmpdir()}/${appPrefix}`
export const tempFilePath = () => `${tempDirectoryPath()}/temp.svg`

/* Prevents refresh when SvgIO_Module calls update file,
 since we only want to refresh when inkscape save updates file */
let skipRefresh = false


export abstract class svgH {

  static async getTempSvg(): Promise<string> {
    try { return await p.readFile(tempFilePath(), { encoding: 'utf-8' }) }
    catch { return '' }
  }

  static async openSvgWithDefaultProgram() {
    function getCommandLine() {
      switch (process.platform) {
        case 'darwin': return 'open ';
        case 'win32': return 'start ';
        // case 'win64': return 'start';
        default: return 'xdg-open ';
      }
    }
    exec(getCommandLine() + tempFilePath(), (e) => e ? console.log(e) : '')
  }

  static async updateTempSvg({ data }: updateTempSvgParams) {
    skipRefresh = true
    try {
      await p.writeFile(tempFilePath(), data, { encoding: 'utf-8' })
      await inkscapeH.fileRebase()
    } catch {
      this.writeTempSvg(data)
    }
  }

  static async exportSvg(fileStr: string) {
    try {
      const exportPath = dialog.showSaveDialogSync(mainWindow!, {
        properties: ['showOverwriteConfirmation'],
        title: 'Export path',
        filters: [
          { name: 'svg', extensions: ['svg'] },
        ]
      })
      if (!exportPath) return
      await p.writeFile(`${exportPath}.svg`, fileStr)
    } catch {
      console.log('error on export')
    }
  }

  static async writeTempSvg(data: string) {
    try { await p.mkdir(tempDirectoryPath()) }
    catch (e: any) { e.code == 'EEXIST' ? '' : console.log(e) }

    await p.writeFile(tempFilePath(), data, { encoding: 'utf-8' })
    inkscapeH.fileRebase()

    unwatchFile(tempFilePath())
    this.watchTempSvg()
  }

  static watchTempSvg() {
    watchFile(tempFilePath(), { interval: 200 }, () => {
      !skipRefresh ? mainWindow?.webContents.send('updatedSvg') : skipRefresh = false
    })
  }
}

try { svgH.watchTempSvg() } catch { }
