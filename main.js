const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 700});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  var application_menu = [
    {
      label: '菜单',
      submenu: [
        {
          label: '调试',
          submenu: [
            {
              label: '启动调试',
              accelerator: 'CmdOrCtrl+Shift+I',
              click: () => {
                mainWindow.openDevTools();
              }
            },
            {
              label: '关闭调试',
              accelerator: 'CmdOrCtrl+B',
              click: () => {
                mainWindow.closeDevTools();
              }
            }
          ]
        },{ 
          label: '关闭',
          accelerator: 'CmdOrCtrl+Q',
          selector: 'terminate:',
          click: () => {
            app.quit();
          }
        }
      ]
    },{
      label: '单选框测试',
      submenu: [
        {
          label: '单选框1',
          type: 'radio',
          checked: true
        },
        {
          label: '单选框1',
          type: 'radio',
        },
        {
          label: '单选框1',
          type: 'radio',
        }                
      ]
    },{
      label: '多选框测试',
      submenu: [
        {
          label: '多选框1',
          type: 'checkbox',
          checked: true
        },
        {
          label: '多选框1',
          type: 'checkbox',
        },
        {
          label: '多选框1',
          type: 'checkbox',
        }                
      ]
    },
    {
      label: '操作',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '打开文件',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
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

  menu = Menu.buildFromTemplate(application_menu);
  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
