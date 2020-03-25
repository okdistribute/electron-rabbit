const serverHandlers = require('./my-app-ipc')
const hoist = require('hoist')

const { ipcRenderer } = require('electron')
ipcRenderer.on('set-socket', (event, { name }) => {
  hoist.init(name, serverHandlers)
})
