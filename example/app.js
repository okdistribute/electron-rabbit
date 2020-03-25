#!/usr/bin/env electron

const electron = require('electron')
const path = require('path')
const middleware = require('hoist')
const app = electron.app

var SOCKET_NAME = 'my-app'
var bg, win, ipc

app.once('ready', function () {
  ipc = new middleware.Client()
  ipc.connect(SOCKET_NAME)
  bg = createBgWindow(SOCKET_NAME)
  win = createWindow(SOCKET_NAME)
  ipc.send('start-first-long-running-process', function (err) {
    if (err) console.error(err)
    console.log('done!')
  })

  ipc.on('error', function (err) {
    console.error(err)
    electron.dialog.showErrorBox('Error', err)
  })

  win.on('closed', function () {
    win = null
    bg = null
    app.quit()
  })
})

const BrowserWindow = electron.BrowserWindow

// Create a hidden background window
function createBgWindow (socketName) {
  var win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 700,
    height: 700,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  var BG = 'file://' + path.join(__dirname, '/background.html')
  win.loadURL(BG)
  win.webContents.on('did-finish-load', () => {
    bg.webContents.openDevTools()
    win.webContents.send('set-socket', {
      name: socketName
    })
  })
  win.on('closed', () => {
    console.log('background window closed')
    app.quit()
  })
  return win
}

function createWindow (socketName) {
  var INDEX = 'file://' + path.join(__dirname, './index.html')
  var win = new BrowserWindow({
    title: 'My App',
    show: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'index-preload.js')
    }
  })

  win.loadURL(INDEX)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', {
      name: socketName
    })
  })

  return win
}
