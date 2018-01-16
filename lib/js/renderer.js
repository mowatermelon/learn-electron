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
dataMenu.append(new MenuItem({ label: '页面是否正在加载',click: () => { getNotification("页面是否正在加载",checkViewLoading());} }));
dataMenu.append(new MenuItem({ label: '页面是否在等待主进程加载',click: () => { getNotification("页面是否在等待主进程加载",checkViewWaiting());} }));
dataMenu.append(new MenuItem({ label: '页面是否能前进',click: () => { getNotification("页面是否能前进",checkViewForward());} }));
dataMenu.append(new MenuItem({ label: '页面是否能后退',click: () => { getNotification("页面是否能后退",checkViewBack());} }));
dataMenu.append(new MenuItem({ label: '获取当前网址',click: () => { getNotification("获取当前网址",getViewUrl());} }));
dataMenu.append(new MenuItem({ label: '获取当前标题',click: () => { getNotification("获取当前标题",getViewTitle());} }));
dataMenu.append(new MenuItem({ label: '获取是否可偏移',click: () => { getNotification("获取是否可偏移",checkViewToOffset(2));} }));
dataMenu.append(new MenuItem({ label: '获取调试器是否打开',click: () => { getNotification("获取调试器是否打开",checkViewDevToolsO());} }));
dataMenu.append(new MenuItem({ label: '获取调试器是否聚焦',click: () => { getNotification("获取调试器是否聚焦",checkViewDevToolsF());} }));
dataMenu.append(new MenuItem({ label: '获取页面是否静音',click: () => { getNotification("获取页面是否静音",checkViewAudioMuted());} }));

let loadMenu = new Menu();
loadMenu.append(new MenuItem({ label: '刷新',click: () => {viewReload();} }));
loadMenu.append(new MenuItem({ label: '强制刷新',click: () => {viewReloadI();} }));
loadMenu.append(new MenuItem({ label: '后退',click: () => {viewBack();} }));
loadMenu.append(new MenuItem({ label: '前进',click: () => {viewForward();} }));
loadMenu.append(new MenuItem({ label: '放大',visible: true,click: () => {viewZoomIn();} }));
loadMenu.append(new MenuItem({ label: '缩小',visible: true,click: () => {viewZoomOut();} }));
loadMenu.append(new MenuItem({ label: '清除缓存',click: () => {viewClearH();} }));
loadMenu.append(new MenuItem({ label: '切换调试器',click: () => {checkViewDevToolsO()?viewCloseDev():viewOpenDev();} }));
loadMenu.append(new MenuItem({ label: '搜索',visible: true,click: () => {viewFind("watermelon");} }));
loadMenu.append(new MenuItem({ label: '打印',visible: false,click: () => {viewPrint();} }));
loadMenu.append(new MenuItem({ label: '替换',enabled: false,click: () => {viewReplace("watermelon");} }));
loadMenu.append(new MenuItem({ label: '强制替换',enabled: false,click: () => {viewReplaceM("watermelon");} }));
loadMenu.append(new MenuItem({ label: '插入',enabled: false,click: () => {viewInsert("watermelon");} }));
loadMenu.append(new MenuItem({ label: '页面静音',enabled: true,click: () => {checkViewAudioMuted()?viewSetAudio(false):viewSetAudio(true)} }));

let saveMenu = new Menu();
saveMenu.append(new MenuItem({ label: '导出为png',click: () => {viewShot();} }));
saveMenu.append(new MenuItem({ label: '导出为pdf',click: () => {viewPdf();} }));

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
function getViewTitle(){
  var webview = getView();
  return webview.getTitle();
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

function checkViewLoading(){
  var webview = getView();
  return webview.isLoading();
}
function checkViewWaiting(){
  var webview = getView();
  return webview.isWaitingForResponse();
}
function checkViewBack(){
  var webview = getView();
  return webview.canGoBack();
}
function checkViewForward(){
  var webview = getView();
  return webview.canGoForward();
}
function checkViewToOffset(offset){
  var webview = getView();
  return webview.canGoToOffset(offset);
}
function checkViewDevToolsO(){
  var webview = getView();
  return webview.isDevToolsOpened();
}
function checkViewDevToolsF(){
  var webview = getView();
  return webview.isDevToolsFocused();
}
function checkViewAudioMuted(){
  var webview = getView();
  return webview.isAudioMuted();
}
function getNotification(title,body){
  console.log(title,body);
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
  webview.loadURL(url);
  // webview.src = url;
}
function viewReload(){
  var webview = getView();
  webview.reload();
}
function viewReloadI() {
  var webview = getView();
  webview.reloadIgnoringCache();
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

let zoomFactor = 1;

function viewZoomIn() {
  var webview = getView();
  var nextHigherZoom = getNextPresetZoom(zoomFactor).high;
  webview.setZoomFactor(nextHigherZoom);
  zoomFactor = nextHigherZoom;
}
function viewZoomOut() {
  var webview = getView();
  var nextLowerZoom = getNextPresetZoom(zoomFactor).low;
  webview.setZoomFactor(nextLowerZoom);
  zoomFactor = nextLowerZoom;
}
function viewZoomLevel() {
  var webview = getView();
  webview.setZoomLevel(zoomFactor);
  zoomFactor = nextLowerZoom;
}

function viewClearH() {
  var webview = getView();
  webview.clearHistory();
}
function viewOpenDev() {
  var webview = getView();
  webview.openDevTools();
}
function viewCloseDev() {
  var webview = getView();
  webview.closeDevTools();
}

function viewReplace(text) {
  var webview = getView();
  webview.replace(text);
}
function viewReplaceM() {
  var webview = getView();
  webview.replaceMisspelling(text);
}
function viewInsert(text) {
  var webview = getView();
  webview.insertText(text)
}
function viewPrint(text) {
  var webview = getView();
  webview.print()
}
function viewFind(text) {
  var webview = getView();
  const options ={
      forward:true,
      findNext:false,
      matchCase:false,
      wordStart:false,
      medialCapitalAsWordStart:false
  }
  webview.findInPage(text);
}
function viewStopFind(text) {
  var webview = getView();
  const actions =['clearSelection','keepSelection','activateSelection'];
  webview.stopFindInPage(actions);
}
function viewSetAudio(muted) {
  var webview = getView();
  webview.setAudioMuted(muted);
}

/** 导出pdf相关 */
function viewPdf(){
  console.log("began print-to-pdf");
  // ipcRenderer.send('print-to-pdf');
  
  var webview = getView();
  const options = {
    title: '保存pdf'
  };    
  dialog.showSaveDialog({}, function(file_path) {
    if (file_path) {
      webview.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(file_path, data, function (error) {
          if (error) {
            throw error;
          }
          shell.openExternal('file://' + file_path);
          const message = `Wrote PDF to: ${file_path}`;
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
function viewShot1(){
  const thumbSize = determineScreenShotSize();
  let options = { types:['window'], thumbnailSize: thumbSize};
  var webview = getView();
  webview.capturePage(function(img){
    console.log(img);
    shell.openExternal('file://' + img.src);
  });
}

function viewShot(){
  const thumbSize = determineScreenShotSize();
  let options = { types:['window'], thumbnailSize: thumbSize};

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
        dialog.showSaveDialog({}, function (file_path) {
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