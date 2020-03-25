#!/usr/bin/env electron

const electron = require('electron')
const path = require('path')

var _socketName = 'my-app'
var bg = createBgWindow(_socketName)

const app = electron.app
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
  console.log('loading bg window')
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

