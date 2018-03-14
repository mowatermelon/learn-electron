# iView-cli

[![logo.png](https://raw.githubusercontent.com/iview/iview/master/assets/logo.png)](https://www.iviewui.com)

## A visual CLI for scaffolding iView projects and offline doc of iView

**Clone and run for a quick way to see Electron in action.**

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# if your system is window,you need to install these two packages first
npm install electron -g
npm install electron-packager -g

# Clone this repository
git clone -b Iviewer https://github.com/mowatermelon/learn-electron.git
# Go into the repository
cd learn-electron
# Install dependencies
cnpm i
# Run the app
npm start
# package win32 application
npm run package:win32
# package win64 application
npm run package:win64
# package linux32 application
npm run package:linux32
# package linux64 application
npm run package:linux64
# package mac application
npm run package:mac
```

## Features

- Configuring simply
- Support both Mac and Windows
- openDevTools && closeDevTools