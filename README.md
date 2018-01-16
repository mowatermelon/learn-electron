# electron-watermelon

**Clone and run for a quick way to see Electron in action.**

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# if your system is window,you need to install these two packages first
npm install electron -g
npm install electron-packager -g

# Clone this repository
git clone https://github.com/mowatermelon/learn-electron.git
# Go into the repository
cd learn-electron
# Install dependencies
npm install
# Run the app
npm start
# package win32 application
npm run package:win32
# package win64 application
npm run package:win64
# package linux application
npm run package:linux
# package mac application
npm run package:mac
```

## features

- action test
  - openFile
  - undo
  - redo
  - cut
  - copy
  - paste
  - selectall
  - unselect
  - delete
  - fullScreen
  - print

- radio test

- checkbox test

- aid-action test

  - DevTools test
    - openDevTools
    - closeDevTools
  - quit test
    - function quit
    - normal quit
  - dialog test
    - showMessageBox
    - showSaveDialog
    - showErrorBox

- rightClick
  - webview action test
    - refresh
    - force refresh
    - goBack
    - goForward
    - zoomIn
    - zoomOut
    - ClearHistory
    - toggle DevTools
    - find in page
    - print
    - replace
    - replace match style
    - insert text
    - AudioMuted

  - alert test

  - webview info test
    - checkViewForward
    - checkViewBack
    - getViewUrl
    - getViewTitle
    - canGoToOffset
    - isDevToolsOpen
    - isDevToolsFocus
    - isAudioMuted
    - isLoading
    - isWaitingForResponse
    - Notification

  - webview changeViewUrl test

  - webview saveMenu test
    - saveScreenShot
    - savePdf

- Tray
  - win.show
  - win.hide
  - app.quit

## Tip

Package the corresponding system needs to be consistent with the current operating system

## learn-base

**Use this app along with the [Electron API Demos](http://electron.atom.io/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).