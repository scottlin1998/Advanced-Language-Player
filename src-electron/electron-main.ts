import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD!)
    }
  })

  mainWindow.loadURL(process.env.APP_URL!)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow!.webContents.closeDevTools()
    })
  }
  // 窗口准备关闭时, 退出mpv
  mainWindow.on('close', () => mainWindow!.webContents.send('mpv-exit'))
  // mpv进程退出时，退出应用
  ipcMain.on('mpv-exit', () => app.quit());

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}


// 单实例模式
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      // mainWindow.webContents.send('path', argv[9]);
      mainWindow.focus()
      mainWindow.show()
    }
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
