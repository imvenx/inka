import { app, BrowserWindow, ipcMain, nativeTheme, } from 'electron';
import path from 'path';
import os from 'os';
import { promises as p, mkdir, copyFile, existsSync } from "fs"
import { projectH } from './handlers/project_h';
import { svgH } from './handlers/svgH';
import { inkscapeH } from './handlers/inkscape_h';
import { ConfigH } from './handlers/config_h';
import { logInkaError } from './utils/utils';

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
  ConfigH.setWorkspace()
  let initial = 214
  let posy = ConfigH.workArea.height - initial - 4
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: ConfigH.windowSize()?.width ?? ConfigH.workArea.width,
    height: ConfigH.windowSize()?.height ?? initial,
    x: ConfigH.windowPosition()?.x ?? ConfigH.workArea.x,
    y: ConfigH.windowPosition()?.y ?? posy,
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
    // we dont want get opened on start
    //inkscapeH.openInkscapeWindow()

  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

}

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
// let filePath = ''
// const projectsFolderPath = 'inka_projects'
// export const tempFilePath = () => `${projectsFolderPath}/inka.svg`

function resetWindow(): number {
  try {

    if (mainWindow!.isMaximized()) {
      mainWindow!.unmaximize();
    }
    let minHeight = 740 / ConfigH.scaleFactor
    let maxHeight = ConfigH.workArea.height - mainWindow!.getSize()[1]
    if (maxHeight < minHeight) {
      maxHeight = ConfigH.workArea.height - minHeight
    } else {
      maxHeight = mainWindow!.getSize()[1]
    }
    if (ConfigH.barPos == "top") {
      mainWindow!.setSize(ConfigH.workArea.width, maxHeight);
      mainWindow!.setPosition(ConfigH.workArea.x, ConfigH.workArea.height - maxHeight + ConfigH.barSize)
    } else {
      mainWindow!.setSize(ConfigH.workArea.width, maxHeight);
      mainWindow!.setPosition(ConfigH.workArea.x, ConfigH.workArea.height - maxHeight);
    }
    return maxHeight
  }
  catch (e) {
    console.log(e, 'Error on try reset window')
    return -1
  }
}

function onTop() {
  try {

    if (!mainWindow) return logInkaError("mainWindow is undefined", "")

    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    mainWindow.setAlwaysOnTop(true, "floating");
    mainWindow.setFullScreenable(false);
    // Below statement completes the flow
    mainWindow.moveTop();
  }
  catch (e) {
    console.log(e, 'Error on try set config')
    return false
  }
}

function onFloat() {
  try {

    mainWindow!.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: false });
    mainWindow!.setAlwaysOnTop(false, "floating");
    mainWindow!.setFullScreenable(true);
    // Below statement completes the flow
    //mainWindow!.moveTop();
  }
  catch (e) {
    console.log(e, 'Error on try set config')
    return false
  }
}
app.whenReady().then(async () => {
  createWindow()
  inkscapeH.profileDir()
  ipcMain.handle('createProject', ({ }, p) => projectH.createProject(p))
  ipcMain.handle('loadProject', ({ }, p) => projectH.loadProject(p))
  ipcMain.handle('saveProject', ({ }, p) => projectH.saveProject(p))

  ipcMain.handle('getTempSvg', ({ }) => svgH.getTempSvg())
  ipcMain.handle('updateTempSvg', ({ }, p) => svgH.updateTempSvg(p))
  ipcMain.handle('resetInkscapePath', ({ }) => inkscapeH.resetInkscapePath())
  ipcMain.handle('exportSvg', ({ }, fileStr: string) => svgH.exportSvg(fileStr))

  ipcMain.handle('openSvgWithInkscape', () => {
    inkscapeH.undock()
    inkscapeH.openInkscapeWindow()
  })
  ipcMain.handle('openSvgWithDefaultProgram', () => svgH.openSvgWithDefaultProgram())
  const windowSize = mainWindow?.getSize()
  ipcMain.handle('dock', () => {
    const windowSize = mainWindow?.getSize()
    let heightOf = resetWindow()
    inkscapeH.dock(ConfigH.workArea.x,ConfigH.workArea.y, ConfigH.workArea.width, ConfigH.workArea.height - (ConfigH.workArea.y + 5 + (heightOf * ConfigH.scaleFactor)))
    //app.relaunch()
  })
  ipcMain.handle('undock', () => {
    inkscapeH.undock()
  })
  mainWindow?.on('resize', () => {
    const windowSize = mainWindow?.getSize()
    let undock = ConfigH.windowSize.length == 2 && windowSize &&
      (ConfigH.windowSize()?.width != windowSize[0] ||
        ConfigH.windowSize()?.height != windowSize[1])
    if (windowSize) ConfigH.saveInkaWindowSize(windowSize[0], windowSize[1])
    if (undock) {
      onFloat();
      inkscapeH.undock()
    }
  })
  mainWindow?.on('move', () => {
    const windowPosition = mainWindow?.getPosition()
    const windowSize = mainWindow?.getSize()
    let undock = ConfigH.windowSize.length == 2 && windowSize &&
      (ConfigH.windowSize()?.width != windowSize[0] ||
        ConfigH.windowSize()?.height != windowSize[1])
    if (windowPosition) ConfigH.saveInkaWindowPosition(windowPosition[0], windowPosition[1])
    if (undock) {
      onFloat();
      inkscapeH.undock()
    }
  })
  mainWindow?.on('close', () => {
    inkscapeH.undock()
  })
  ipcMain.handle('closeApp', () => closeApp())
  mainWindow?.webContents.send('updatedSvg')

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


