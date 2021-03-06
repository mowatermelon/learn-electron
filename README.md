# watermelon-todolist

**Clone and run for a quick way to see Electron in action.**

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# if your system is window,you need to install these two packages first
npm install electron -g
npm install electron-packager -g

# Clone this repository
git clone -b todolist https://github.com/mowatermelon/learn-electron.git todolist
# Go into the repository
cd todolist
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

- todo
  - add todo
  - remove todo
  - edit todo
  - random change background image

## screenshot

- when the task is not fully completed

![image](https://user-images.githubusercontent.com/18508817/40623137-e1e83568-62d7-11e8-9fcd-286ccf50206d.png)

- when all tasks are completed

![image](https://user-images.githubusercontent.com/18508817/40623192-29d6a7ba-62d8-11e8-9d51-3b8335009d4f.png)

- when you want to delete a tasks

![image](https://user-images.githubusercontent.com/18508817/40623248-77592fb2-62d8-11e8-8eba-c5d387d690cb.png)

## Tip

Package the corresponding system needs to be consistent with the current operating system

## learn-base

**Use this app along with the [Electron API Demos](http://electron.atom.io/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start).