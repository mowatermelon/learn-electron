// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {remote,desktopCapturer} = require('electron');
const {Menu, MenuItem,dialog,shell,BrowserWindow,app} = remote;

/**文件操作相关依赖 */
const fs = require('fs');
const os = require('os');
const path = require('path');

/**导出为pdf相关依赖 */
//BrowserWindow,ipcRenderer,ipcMain


/**截图相关依赖 */

const electronScreen = require('electron').screen;
// const shell = electron.shell;

let dataMenu = new Menu();
dataMenu.append(new MenuItem({ label: '页面是否能前进',click: () => { getNotification("页面是否能前进",checkViewForward());} }));
dataMenu.append(new MenuItem({ label: '页面是否能后退',click: () => { getNotification("页面是否能后退",checkViewBack());} }));
dataMenu.append(new MenuItem({ label: '获取当前网址',click: () => { getNotification("获取当前网址",getViewUrl());} }));

let loadMenu = new Menu();
loadMenu.append(new MenuItem({ label: '刷新',click: () => {viewReload();} }));
loadMenu.append(new MenuItem({ label: '后退',click: () => {viewBack();} }));
loadMenu.append(new MenuItem({ label: '前进',click: () => {viewForward();} }));
loadMenu.append(new MenuItem({ label: '放大',visible: true,click: () => {viewZoomIn();} }));
loadMenu.append(new MenuItem({ label: '缩小',visible: true,click: () => {viewZoomOut();} }));

let saveMenu = new Menu();
saveMenu.append(new MenuItem({ label: '导出为png',click: () => {viewOldShot();} }));
saveMenu.append(new MenuItem({ label: '导出为pdf',click: () => {viewOldPdf();} }));

let urlMenu = new Menu();
urlMenu.append(new MenuItem({ label: '跳转到博客',click: () => {viewLoad("https://mowatermelon.github.io/");} }));
urlMenu.append(new MenuItem({ label: '跳转到简历',click: () => {viewLoad("http://melonhero.coding.me");} }));

let menuMain = new Menu();
menuMain.append(new MenuItem({ label: '页面操作',submenu: loadMenu }));
menuMain.append(new MenuItem({ label: '弹窗测试', click () { alert('item clicked'); } }));
menuMain.append(new MenuItem({ label: '页面信息',submenu: dataMenu}));
menuMain.append(new MenuItem({ label: '页面跳转',submenu: urlMenu}));
menuMain.append(new MenuItem({ label: '页面保存',submenu: saveMenu}));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menuMain.popup(remote.getCurrentWindow());
}, false);

/* get  data ---------------------------------------------------------*/
function getView(){
  var webview = document.querySelector('webview');
  return webview;
}
function getViewUrl(){
  var webview = getView();
  return webview.getURL();
}
function getNextPresetZoom(zoomFactor) {
  var preset = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2,
                2.5, 3, 4, 5];
  var low = 0;
  var high = preset.length - 1;
  var mid;
  while (high - low > 1) {
    mid = Math.floor((high + low)/2);
    if (preset[mid] < zoomFactor) {
      low = mid;
    } else if (preset[mid] > zoomFactor) {
      high = mid;
    } else {
      return {low: preset[mid - 1], high: preset[mid + 1]};
    }
  }
  return {low: preset[low], high: preset[high]};
}
function checkViewBack(){
  var webview = getView();
  return webview.canGoBack();
}
function checkViewForward(){
  var webview = getView();
  return webview.canGoForward();
}

function getNotification(title,body){
  const notification = {
    title: title,
    body: body,
    icon:path.join(__dirname, '../../lib/img/bgIcon.png'),
    silent:false
  }
  const myNotification = new window.Notification(notification.title, notification);
  myNotification.onclick = () => {
    console.log('Notification clicked');
  };
  myNotification.onshow = () => {
    console.log('Notification show');
  };
}

/* set  action ---------------------------------------------------------*/
function viewLoad(url){
  var webview = getView();
  webview.src = url;
}
function viewReload(){
  var webview = getView();
  webview.reload();
}
function viewStop(){
  var webview = getView();
  webview.stop();
}
function viewBack(){
  var webview = getView();
  webview.goBack();
}
function viewForward(){
  var webview = getView();
  webview.goForward();
}
function viewZoomIn() {
  var webview = getView();
  webview.getZoom(function(zoomFactor) {
    var nextHigherZoom = getNextPresetZoom(zoomFactor).high;
    webview.setZoom(nextHigherZoom);
  });
}
function viewZoomOut() {
  var webview = getView();
  webview.getZoom(function(zoomFactor) {
    var nextLowerZoom = getNextPresetZoom(zoomFactor).low;
    webview.setZoom(nextLowerZoom);
  });
}

/** 导出pdf相关 */
function viewPdf(){
  console.log("began print-to-pdf");
  // ipcRenderer.send('print-to-pdf');
  
  var webview = getView();
  const options = {
    title: '保存pdf'
  };    
  dialog.showSaveDialog(options, function(file_path) {
    if (file_path) {
      webview.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(pdfPath, data, function (error) {
          if (error) {
            throw error;
          }
          shell.openExternal('file://' + pdfPath);
          const message = `Wrote PDF to: ${pdfPath}`;
          console.log(message);
          getNotification("导出pdf的地址",message);   
        })
      });
    }else{
      getNotification('保存图片','保存失败');     
    }
  });
}

//直接保存pdf到默认地址
function viewOldPdf(){
  var webview = getView();

  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // Use default printing options
  webview.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error;
      }
      shell.openExternal('file://' + pdfPath);
      const message = `Wrote PDF to: ${pdfPath}`;
      console.log(message);
      getNotification("导出pdf的地址",message);   
    })
  });
}

/** 截图相关 */
function viewShot(){
  const thumbSize = determineScreenShotSize();
  let options = { types:['window', 'screen'], thumbnailSize: thumbSize};
  console.log(app);
  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error);
    //sources包含系统当前打开的所有窗体页面
    sources.forEach(function (source) {
      // console.log(source);
      
      //只保存当前软件的截图
      if (source.id.indexOf("window")>-1&&source.name === app.getName()) {
        // console.log("source");
        // console.log(source);

        const options = {
          title: '保存图片',
          filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
          ]
        };
        dialog.showSaveDialog(source,options, function (file_path) {
          console.log(file_path);
          if (file_path) {
            fs.writeFile(file_path, source.thumbnail.toPng(), function (error) {
              if (error) return console.log(error)
              
              shell.openExternal('file://' + file_path)
              const message = `Saved screenshot to: ${file_path}`
              console.log(message);
              getNotification("导出截图的地址",message);          
            });
          }else{
            getNotification('保存图片','保存失败');     
          }
        });
      }
    }); 

  })
}

//直接保存图片到默认地址
function viewOldShot(){
  const thumbSize = determineScreenShotSize();
  let options = { types:['window', 'screen'], thumbnailSize: thumbSize};
  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error);
    //sources包含系统当前打开的所有窗体页面
    sources.forEach(function (source) {
      // console.log(source);
      
      //只保存当前软件的截图
      if (source.id.indexOf("window")>-1&&source.name === app.getName()) {

        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');

        fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
          if (error) return console.log(error)
          
          shell.openExternal('file://' + screenshotPath)
          const message = `Saved screenshot to: ${screenshotPath}`
          console.log(message);
          getNotification("导出截图的地址",message);          
        });

      }
    }); 

  })
}


function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
  const maxDimension = Math.max(screenSize.width, screenSize.height);
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}