const electron = require('electron');
const path = require('path');
const autoUpdater = require('./lib/js/auto-updater');
const {app, BrowserWindow, Menu,shell,dialog,Tray,Notification,globalShortcut} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is garbage collected.
let mainWindow = null;
let tray = null;
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
    autoUpdater.createShortcut(function () { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function () { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}


function initialize () {
  var shouldQuit = makeSingleInstance();
  if (shouldQuit) return app.quit();

  function createWindow () {
    /**
     * @param frame set false,BrowserWindow will have no menu
     */
    var windowOptions = {
      width: 800, 
      height: 700,
      frame: true,
      icon:path.join(__dirname, 'lib/img/favicon.ico'),
      show: false
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
    if (process.platform != 'darwin')
      app.quit();
  });

  app.on('will-quit', function () {
    globalShortcut.unregisterAll()
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  })  
}

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function loadMenu(){
  const version = app.getVersion()

  let application_menu = [
    {
      label: '操作',
      submenu: [
        {
          label: '打开文件',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            dialog.showOpenDialog({
              properties: [ 'openFile', 'openDirectory', 'multiSelections' ]
            }, function (files) {
              if (files){
                console.log(files);
                getNotification("你当前选择的文件地址",files[0]);
              }
            })
          }
        },{
          type: 'separator'
        },{
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        }, {
          label: '重做',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        }, {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        }, {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },{
          type: 'separator'
        },{
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },{
          type: 'separator'
        },{
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
    },    
    {
      label: '单选框测试',
      submenu: [
        {
          label: '单选框1',
          type: 'radio',
          checked: true
        },
        {
          label: '单选框2',
          type: 'radio',
        },
        {
          label: '单选框3',
          type: 'radio',
        }                
      ]
    },
    {
      label: '多选框测试',
      submenu: [
        {
          label: '多选框1',
          type: 'checkbox',
          checked: true
        },
        {
          label: '多选框2',
          type: 'checkbox',
        },
        {
          label: '多选框3',
          type: 'checkbox',
        }                
      ]
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
          label: '关闭窗体',
          submenu: [
            { 
              label: '方法关闭',
              accelerator: 'CmdOrCtrl+Q',
              selector: 'terminate:',
              click: () => {
                app.quit();
              }
            },{
              label: '默认关闭',
              accelerator: 'CmdOrCtrl+W',
              role: 'close'
            }
          ]
        }, 
        {
          label: '窗体提示测试',
          submenu: [
          {
            label: '文字比较少的',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                const options = {
                  type: 'info',
                  title: app.getName(),
                  buttons: ['确定','取消'],
                  message: '窗体提示案例'
                }
                dialog.showMessageBox(focusedWindow, options, function () {});
              }
            }
          },
          {
            label: '文字比较多的',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                const options = {
                  type: 'info',
                  title: app.getName(),
                  buttons: ['Ok'],
                  message: '窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例窗体提示案例'
                }
                dialog.showMessageBox(focusedWindow, options, function () {});
              }
            }
          },
          {
            label: '警告窗体',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                dialog.showErrorBox('错误提示', '不知道怎么的，就出错了，日常摊手.jpg');
              }
            }
          },
          {
            label: '文件保存窗体',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                const options = {
                  title: '保存图片',
                  filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
                  ]
                };
                dialog.showSaveDialog(options, function (filename) {
                  if (!filename) filename = '没有找到路径';
                  console.log(`path save to ${filename}`);
                });
              }
            }
          }

        ]

        }
      ]
    },    
    {
      label: '帮助',
      submenu: [
        {
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
        },{
          label: '重新加载更新包',
          enabled: true,
          visible:true,
          key: 'restartToUpdate',
          click: () => {
            console.log("restartToUpdate");
            electron.autoUpdater.quitAndInstall();
          }
        },{
          label: '重新加载列表',
          enabled: true,
          visible:false,
          key: 'reopenMenuItem',
          click: () => {
            console.log("reopenMenuItem");            
            app.emit('activate')
          }
        },{
          type: 'separator'
        },{
          label: '了解更多',
          click: () => {
            shell.openExternal('https://github.com/mowatermelon/learn-electron');
          }
        },{
          type: 'separator'
        },{
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },{
          label: '最大化',
          accelerator: 'CmdOrCtrl+L',
          role: 'maximize',
          click: (item, focusedWindow) =>{
            if (focusedWindow) {
              focusedWindow.isMaximized() ? focusedWindow.unmaximize() : focusedWindow.maximize();
            }
          }
        },{
          type: 'separator'
        },{
          label: '获取窗体大小',
          click: (item, focusedWindow) =>{
            if (focusedWindow) {
              const options = {
                type: 'info',
                title: app.getName(),
                buttons: ['Ok','Close'],
                message: '当前窗体大小'+focusedWindow.getSize().toString()
              };
              dialog.showMessageBox(focusedWindow, options, function () {});
              
            }
          }

        },{
          label: '获取窗体位置',
          click: (item, focusedWindow) =>{
            if (focusedWindow) {
              const options = {
                type: 'info',
                title: app.getName(),
                buttons: ['Ok','Close'],
                message: '当前窗体位置'+focusedWindow.getPosition().toString()
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
      submenu: [
        {
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
          click: () => { app.quit(); }
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

function getNotification(title,body){
  const notification = {
    title: title,
    body: body,
    icon:path.join(__dirname, '../../lib/img/bgIcon.png'),
    silent:false
  };
  const myNotification = new Notification(notification.title, notification);
  myNotification.onclick = () => {
    console.log('Notification clicked');
  };
  myNotification.onshow = () => {
    console.log('Notification show');
  };
}

function addTray(){
  tray = new Tray(path.join(__dirname, 'lib/img/favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开软件',
      click: () =>{
        if(!mainWindow.isVisible()){
          mainWindow.show();
        }
      }
    },
    {
      label: '隐藏软件',
      click: () =>{
        if(mainWindow.isVisible()){
          mainWindow.hide();
        }
      }
    },
    {
      label: '关闭软件',
      click: () =>{
        app.quit();
      }
    }
  ]);

  tray.setToolTip('西瓜酱的小应用');

  tray.setContextMenu(contextMenu);

}