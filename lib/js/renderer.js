// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote} = require('electron');
const {Menu, MenuItem} = remote;

let submenu = new Menu();
submenu.append(new MenuItem({ label: '刷新',click: () => {document.querySelector('webview').reload();} }));
submenu.append(new MenuItem({ label: '弹窗测试', click () { alert('item clicked'); } }));
submenu.append(new MenuItem({ label: '后退',click: () => {document.querySelector('webview').goBack();} }));
submenu.append(new MenuItem({ label: '前进',click: () => {document.querySelector('webview').goForward();} }));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  submenu.popup(remote.getCurrentWindow());
}, false);
