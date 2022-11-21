import { createProjectParams, loadProjectParams, loadProjectResult, saveProjectParams, updateTempSvgParams } from "app/public/sharedModels"
import { exec } from "child_process"
import { dialog } from "electron"
import { mkdirSync, readFileSync, unwatchFile, watchFile, writeFile, writeFileSync } from "fs"
import { tmpdir } from "os"
import { mainWindow } from "../electron-main"

const appPrefix = 'cssvg';
const tempDirectoryPath = () => `${tmpdir()}/${appPrefix}`
const tempFilePath = () => `${tempDirectoryPath()}/temp.svg`

try {
  watchFile(tempFilePath(), { interval: 200 }, () => {
    mainWindow?.webContents.send('updatedSvg')
  })
} catch { }

export const projectH = {

  async createProject({ doImportSvg }: createProjectParams) {
    let data = svgTemplate
    if (doImportSvg) {
      const importedFilePath = (await dialog.showOpenDialog(mainWindow!,
        {
          properties: ['openFile'],
          title: 'Import SVG',
          filters: [
            { name: 'SVG', extensions: ['svg'] },
          ]
        })).filePaths[0]
      if (!importedFilePath) return false
      data = readFileSync(importedFilePath, 'utf-8')
    }

    writeTempSvg(data)
    return true
  },

  async loadProject({ filePath }: loadProjectParams = {}): Promise<loadProjectResult> {
    if (!filePath) {
      filePath = (dialog.showOpenDialogSync(mainWindow!, {
        title: 'Load Project',
        filters: [
          { name: 'json', extensions: ['json'] },
        ]
      }))?.[0]
    }
    if (!filePath) return {}
    if (!filePath.includes('.json')) filePath += '.json'

    let projectStr = readFileSync(filePath, { encoding: 'utf-8' })
    if (!projectStr) return {}
    let project = JSON.parse(projectStr) as any

    writeTempSvg(project.svgFile)
    delete project.svgFile

    return { data: project, filePath: filePath }
  },

  async saveProject({ filePath, data }: saveProjectParams): Promise<string> {
    if (!filePath) {
      filePath = dialog.showSaveDialogSync(mainWindow!, {
        properties: ['showOverwriteConfirmation'],
        title: 'Save Project',
        filters: [
          { name: 'json', extensions: ['json'] },
        ]
      })
      if (!filePath) return ''
    }

    if (!data) data = {}
    data.svgFile = this.getTempSvg()
    if (!data.svgFile) return ''

    filePath = filePath.replace('.json', '')
    writeFileSync(`${filePath}.json`, JSON.stringify(data), { encoding: 'utf-8' })
    return filePath
  },

  getTempSvg(): string {
    return readFileSync(tempFilePath(), { encoding: 'utf-8' })
  },

  async openProjectInInkscape() {
    function getCommandLine() {
      switch (process.platform) {
        case 'darwin': return 'open ';
        case 'win32': return 'start ';
        // case 'win64': return 'start';
        default: return 'xdg-open ';
      }
    }
    exec(getCommandLine() + tempFilePath(), (e) => e ? console.log(e) : '')
  },

  async updateTempSvg({ data }: updateTempSvgParams) {
    try {
      writeFileSync(tempFilePath(), data, { encoding: 'utf-8' })
      refreshInkscapeUI()
    } catch {
      writeTempSvg(data)
    }
  }
}


function refreshInkscapeUI() {
  exec(`gdbus call --session --dest org.inkscape.Inkscape --object-path /org/inkscape/Inkscape/window/1 --method org.gtk.Actions.Activate document-revert [] {}`)
}

async function writeTempSvg(data: string) {
  try { mkdirSync(tempDirectoryPath()) } catch { }
  writeFileSync(tempFilePath(), data, { encoding: 'utf-8' })

  refreshInkscapeUI()

  unwatchFile(tempFilePath())
  watchFile(tempFilePath(), { interval: 200 }, () => {
    // !skipRefresh ?
    mainWindow?.webContents.send('updatedSvg')
    //  : skipRefresh = false
  })
}


// function createDirectoryIfDontExist(path: string) {
//   mkdir(path, (err) => {
//     if (err) {
//       if (err.code != 'EEXIST') {
//         console.log(err)
//         return err
//       }
//     }
//   })
// }

const svgTemplate = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg width="1000mm" height="1000mm" viewBox="0 0 999.99995 999.99995" version="1.1" id="svg5" inkscape:version="1.1 (c4e8f9e, 2021-05-24)" sodipodi:docname="template.svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview id="namedview7" pagecolor="#c8c8c8" bordercolor="#666666" borderopacity="1.0" inkscape:pageshadow="2" inkscape:pageopacity="0" inkscape:pagecheckerboard="0" inkscape:document-units="mm" showgrid="true" inkscape:zoom="0.08" inkscape:cx="912.5" inkscape:cy="1031.25" inkscape:window-width="1331" inkscape:window-height="743" inkscape:window-x="35" inkscape:window-y="0" inkscape:window-maximized="1" inkscape:current-layer="layer1" units="mm" width="1000mm">
    <inkscape:grid type="xygrid" id="grid378" units="mm" spacingx="9.9999999" spacingy="9.9999999" />
  </sodipodi:namedview>
  <defs id="defs2" />
  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" />
</svg>`