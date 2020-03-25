#!/usr/bin/env electron

const electron = require('electron')
const path = require('path')
const rabbit = require('electron-rabbit')
const app = electron.app

var SOCKET_NAME = 'my-app'
var bg, win, ipc

app.once('ready', () => {
  ipc = new rabbit.Client()
  ipc.connect(SOCKET_NAME)
  bg = createBgWindow(SOCKET_NAME)
  win = createWindow(SOCKET_NAME)
  ipc.send('start-first-long-running-process', function (err) {
    if (err) console.error(err)
    console.log('done!')
  })

  ipc.on('error', (err) => {
    console.error(err)
    electron.dialog.showErrorBox('Error', err)
  })

  win.on('closed', () => {
    win = null
    bg = null
    app.quit()
  })
})

const BrowserWindow = electron.BrowserWindow

// Create a hidden background window
function createBgWindow (socketName) {
  var bg = new BrowserWindow({
    x: 0,
    y: 0,
    width: 700,
    height: 700,
    show: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  bg.webContents.openDevTools()
  var BG = 'file://' + path.join(__dirname, '/background.html')
  bg.loadURL(BG)
  bg.webContents.on('did-finish-load', () => {
    bg.webContents.openDevTools()
    bg.webContents.send('set-socket', {
      name: socketName
    })
  })
  bg.on('closed', () => {
    console.log('background bgdow closed')
    app.quit()
  })
  return bg
}

function createWindow (socketName) {
  var INDEX = 'file://' + path.join(__dirname, './index.html')
  var win = new BrowserWindow({
    title: 'My App',
    show: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'client-preload.js')
    }
  })

  win.loadURL(INDEX)

  win.webContents.openDevTools()
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('set-socket', {
      name: socketName
    })
  })

  return win
}
