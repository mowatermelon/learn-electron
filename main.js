const electron = require('electron');
const path = require('path');
const autoUpdater = require('./lib/js/auto-updater');
const {
  app,
  BrowserWindow,
  Menu,
  shell,
  dialog,
  Tray,
  Notification,
  globalShortcut
} = require('electron');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is garbage collected.
let mainWindow = null;
let tray = null;
let win_about = null;
let logo = path.join(__dirname, 'lib/img/favicon.ico');
let slogan = path.join(__dirname, 'lib/img/bgIcon.png');

const debug = /--debug/.test(process.argv[2]);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function () {
      app.quit()
    })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () {
      app.quit()
    })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}


function initialize() {
  var shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();

  function createWindow() {
    /**
     * @param frame set false,BrowserWindow will have no menu
     */
    var windowOptions = {
      width: 800,
      height: 700,
      frame: true,
      icon: logo,
      show: false,
      backgroundColor: '#2e2c29'
    };


    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
    }

    loadMenu();
    addTray();

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.on('show', () => {
      tray.setHighlightMode('always')
    });

    mainWindow.on('hide', () => {
      tray.setHighlightMode('never')
    });
  }

  app.on('ready', () => {
    createWindow();
    autoUpdater.initialize();
  })

  app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
      app.quit();
    }
    tray.destroy();
  });

  app.on('will-quit', function () {
    globalShortcut.unregisterAll();
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  })
}

function makeSingleInstance() {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function loadMenu() {
  const version = app.getVersion()

  let application_menu = [{
      label: '辅助功能',
      submenu: [{
          label: '切换全屏状态',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        }, {
          label: '调试',
          submenu: [{
              label: '启动调试',
              accelerator: (function () {
                if (process.platform === 'darwin') {
                  return 'CmdOrCtrl+Shift+I'
                } else {
                  return 'F12'
                }
              })(),
              click: (item, focusedWindow) => {
                focusedWindow.openDevTools();
              }
            },
            {
              label: '关闭调试',
              accelerator: 'CmdOrCtrl+B',
              click: (item, focusedWindow) => {
                focusedWindow.closeDevTools();
              }
            }
          ]
        },

        {
          label: '关闭窗体',
          submenu: [{
            label: '方法关闭',
            accelerator: 'CmdOrCtrl+Q',
            selector: 'terminate:',
            click: () => {
              app.quit();
            }
          }, {
            label: '默认关闭',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          }]
        }
      ]

    },
    {
      label: '帮助',
      submenu: [{
          label: `Version ${version}`,
          enabled: false
        }, {
          label: '版本更新',
          visible: true,
          key: 'checkForUpdate',
          click: function () {
            console.log("checkForUpdate");
            electron.autoUpdater.checkForUpdates();
          }
        },
        {
          label: '关于 watermelon-todolist',
          click: function () {
            if (win_about == null) {
              win_about = new BrowserWindow({
                width: 300,
                height: 240,
                title: '关于 watermelon-todolist',
                center: true,
                resizable: false,
                frame: true,
                icon: logo,
                minimizable: false,
                maximizable: false
              });
              win_about.setMenu(null)
              win_about.loadURL(url.format({
                pathname: path.join(__dirname, 'lib/page/about.html'),
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
          type: 'separator'
        }, {
          label: '了解更多',
          click: () => {
            shell.openExternal('https://github.com/mowatermelon/learn-electron/tree/todolist');
          }
        }, {
          type: 'separator'
        }, {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.isMinimized() ? focusedWindow.unminimize() : focusedWindow.minimize();
            }
          }
        }, {
          label: '最大化',
          accelerator: 'CmdOrCtrl+L',
          role: 'maximize',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.isMaximized() ? focusedWindow.unmaximize() : focusedWindow.maximize();
            }
          }
        }, {
          type: 'separator'
        }, {
          label: '获取窗体大小',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              const options = {
                type: 'info',
                title: app.getName(),
                buttons: ['Ok', 'Close'],
                message: '当前窗体大小' + focusedWindow.getSize().toString()
              };
              dialog.showMessageBox(focusedWindow, options, function () {});

            }
          }

        }, {
          label: '获取窗体位置',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              const options = {
                type: 'info',
                title: app.getName(),
                buttons: ['Ok', 'Close'],
                message: '当前窗体位置' + focusedWindow.getPosition().toString()
              };
              dialog.showMessageBox(focusedWindow, options, function () {});
            }
          }
        }
      ]
    }
  ];

  if (process.platform == 'darwin') {
    const name = app.getName();
    application_menu.unshift({
      label: name,
      submenu: [{
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        },
      ]
    });
  }
  //全局注册按键行为
  globalShortcut.register('CommandOrControl+Alt+K', function () {
    dialog.showMessageBox({
      type: 'info',
      message: '成功啦!',
      detail: '你成功注册了一个全局的按键行为',
      buttons: ['OK']
    });
  });

  menu = Menu.buildFromTemplate(application_menu);
  Menu.setApplicationMenu(menu);
}

function getNotification(title, body) {
  const notification = {
    title: title,
    body: body,
    icon: slogan,
    silent: false
  };
  const myNotification = new Notification(notification.title, notification);
  myNotification.onclick = () => {
    console.log('Notification clicked');
  };
  myNotification.onshow = () => {
    console.log('Notification show');
  };
}

function addTray() {
  tray = new Tray(logo);
  const contextMenu = Menu.buildFromTemplate([{
      label: '打开软件',
      click: () => {
        if (!mainWindow.isVisible()) {
          mainWindow.show();
        } else {
          if (mainWindow.isMinimized()) {
            mainWindow.unminimize();
          }
        }
      }
    },
    {
      label: '隐藏软件',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        }
      }
    },
    {
      label: '关闭软件',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('西瓜酱的小应用');

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    } else {
      if (mainWindow.isMinimized()) {
        mainWindow.unminimize();
      }
    }
  });
}