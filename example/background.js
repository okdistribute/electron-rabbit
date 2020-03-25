const serverHandlers = require('./my-app-ipc')
const rabbit = require('electron-rabbit')

const { ipcRenderer } = require('electron')
ipcRenderer.on('set-socket', (event, { name }) => {
  rabbit.init(name, serverHandlers)
})
