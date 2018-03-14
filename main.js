const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let logo = path.join(__dirname, 'assets/img/logo.png');
let win = null;
let win_about = null;

let willClose = false;

function createWindow () {
    win = new BrowserWindow({
        width: 360,
        // width: 1000,
        height: 572,
        title: 'iView',
        center: true,
        resizable: false,
        icon: logo,
        titleBarStyle: 'hidden'
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打开开发者工具。
    // win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('close', (event) => {
        if (process.platform !== 'win32' && !willClose) {
            win.hide();
            event.preventDefault();
        }
    });
    win.on('closed', () => {
        win = null;
    });
}

function createMenu () {
    const template = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: '关于 iView',
                    click () {
                        if (win_about == null) {
                            win_about = new BrowserWindow({
                                width: 300,
                                height: 180,
                                title: '关于 iView',
                                center: true,
                                resizable: false,
                                icon: logo,
                                minimizable: false,
                                maximizable: false
                            });

                            win_about.loadURL(url.format({
                                pathname: path.join(__dirname, 'app/about.html'),
                                protocol: 'file:',
                                slashes: true
                            }));

                            win_about.on('closed', (e) => {
                                win_about = null;
                            });
                        }
                    }
                },
                {
                    role: 'quit',
                    label: '退出 iView'
                }
            ],
        },
        {
            label: '辅助功能',
            submenu: [
                {
                    label: '调试',
                    submenu: [
                      {
                        label: '启动调试',
                        accelerator: (function () {
                          if (process.platform === 'darwin') {
                            return 'CmdOrCtrl+Shift+I'
                          } else {
                            return 'F12'
                          }
                        })(),
                        click: (item, focusedWindow) =>{
                          focusedWindow.openDevTools();
                        }
                      },
                      {
                        label: '关闭调试',
                        accelerator: 'CmdOrCtrl+B',
                        click: (item, focusedWindow) =>{
                          focusedWindow.closeDevTools();
                        }
                      }
                    ]
                  },
                  {
                    type: 'separator'
                  },
                  {
                    label: '切换全屏状态',
                    accelerator: (function () {
                      if (process.platform === 'darwin') {
                        return 'Ctrl+Command+F'
                      } else {
                        return 'F11'
                      }
                    })(),
                    click: (item, focusedWindow) =>{
                      if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                      }
                    }
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    createWindow();
    createMenu();
});
app.on('activate', () => {
    if (win == null) {
        createWindow();
    } else {
        win.show();
    }
});
app.on('before-quit', function () {
    willClose = true;
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});