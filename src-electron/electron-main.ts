import { app, BrowserWindow, ipcMain, nativeTheme, } from 'electron';
import path from 'path';
import os from 'os';
import { screen } from 'electron';

import { projectH } from './handlers/project_h';
import { svgH } from './handlers/svgH';
import { inkscapeH } from './handlers/inkscape_h';
import { ConfigH } from './handlers/config_h';

// needed in case process is undefined under Linux
export const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (e) { console.log('Error trying to open devtools') }


export let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */

  screen.getPrimaryDisplay().workAreaSize.height
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: ConfigH.windowSize()?.width ?? screen.getPrimaryDisplay().workAreaSize.width,
    height: ConfigH.windowSize()?.height ?? 214,
    x: ConfigH.windowPosition()?.x ?? 0,
    y: ConfigH.windowPosition()?.y ?? screen.getPrimaryDisplay().workAreaSize.height - 250,
    autoHideMenuBar: true,
    frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    // mainWindow.webContents.on('devtools-opened', () => {
    //   mainWindow?.webContents.closeDevTools();
    // });

    inkscapeH.openInkscapeWindow()

  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

}


// let filePath = ''
// const projectsFolderPath = 'cssvg_projects'
// export const tempFilePath = () => `${projectsFolderPath}/temp.svg`

app.whenReady().then(async () => {
  createWindow()
  ipcMain.handle('createProject', ({ }, p) => projectH.createProject(p))
  ipcMain.handle('loadProject', ({ }, p) => projectH.loadProject(p))
  ipcMain.handle('saveProject', ({ }, p) => projectH.saveProject(p))

  ipcMain.handle('getTempSvg', ({ }) => svgH.getTempSvg())
  ipcMain.handle('updateTempSvg', ({ }, p) => svgH.updateTempSvg(p))
  ipcMain.handle('exportSvg', ({ }, fileStr: string) => svgH.exportSvg(fileStr))

  ipcMain.handle('openSvgWithInkscape', () => inkscapeH.openInkscapeWindow())
  ipcMain.handle('openSvgWithDefaultProgram', () => svgH.openSvgWithDefaultProgram())
  ipcMain.handle('resetInkscapePath', () => inkscapeH.askInkscapePath())
  ipcMain.handle('closeApp', () => closeApp())
  mainWindow?.webContents.send('updatedSvg')

  mainWindow?.on('resize', () => {
    const windowSize = mainWindow?.getSize()
    if (windowSize) ConfigH.saveInkaWindowSize(windowSize[0], windowSize[1])
  })
  mainWindow?.on('move', () => {
    const windowPosition = mainWindow?.getPosition()
    if (windowPosition) ConfigH.saveInkaWindowPosition(windowPosition[0], windowPosition[1])
  })
});


app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // if (mainWindow === undefined) {
  // createWindow();
  // }
});



// async function getSvg(fp: string = ''): Promise<string> {
//   if (!fp) return ''
//   await updateFilePath(fp)

//   // if (!filePath) watchFile(fp, { interval: 200 }, () => {
//   //   mainWindow?.webContents.send('updatedSvg')
//   // })

//   // filePath = fp

//   // mainWindow?.webContents.send('updatedSvg')
//   const file = readFileSync(filePath, 'utf-8')
//   // return { file, filePath }
//   return file
// }

// let skipRefresh = false

// async function updateFile(newFile: string) {
//   skipRefresh = true
//   writeFile(filePath, newFile, (err) => err ? console.log(err) : '')
//   exec(`gdbus call --session --dest org.inkscape.Inkscape --object-path /org/inkscape/Inkscape/window/1 --method org.gtk.Actions.Activate document-revert [] {}`)
// }

// async function updateFilePath(fp: string = ''): Promise<string> {
//   if (filePath) unwatchFile(filePath)

//   if (fp) filePath = fp
//   else filePath = (await dialog.showOpenDialog({ properties: ['openFile'] })).filePaths[0]

//   watchFile(filePath, { interval: 200 }, () => {
//     !skipRefresh ? mainWindow?.webContents.send('updatedSvg') : skipRefresh = false
//   })
//   return filePath
// }

async function closeApp() { mainWindow?.close() }

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

// function saveProject() {
//   dialog.showSaveDialog(mainWindow!, { title: 'Save File', defaultPath: projectsFolderPath })
// }


