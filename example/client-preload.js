const { ipcRenderer } = require('electron')
const rabbit = require('electron-rabbit')

window.middlewareClient = new rabbit.Client()
ipcRenderer.on('set-socket', (event, { name }) => {
  window.middlewareClient.connect(name)
})
