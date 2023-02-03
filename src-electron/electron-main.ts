import { app, BrowserWindow, ipcMain, nativeTheme, } from 'electron';
import path from 'path';
import os from 'os';
import { screen } from 'electron';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

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
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: screen.getPrimaryDisplay().bounds.width,
    height: screen.getPrimaryDisplay().bounds.height / 4,
    autoHideMenuBar: true,
    frame: false,
    x: 0,
    y: screen.getPrimaryDisplay().bounds.height,
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

  ipcMain.handle('openSvgWithInkscape', () => svgH.openSvgWithInkscape())
  ipcMain.handle('openSvgWithDefaultProgram', () => svgH.openSvgWithDefaultProgram())
  ipcMain.handle('closeApp', () => closeApp())
  mainWindow?.webContents.send('updatedSvg')
});


app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    // createWindow();
  }
});

import { readFileSync, unwatchFile, watchFile, writeFile, mkdir, readFile, writeFileSync } from 'fs'
import { exec } from 'child_process';
import { createProjectParams, loadProjectParams, loadProjectResult, saveProjectParams } from 'app/public/sharedModels';
import { projectH } from './handlers/project_h';
import { svgH } from './handlers/svgH';



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


