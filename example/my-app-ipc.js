var handlers = {}
const ipc = require('electron-rabbit')

handlers['start-first-long-running-process'] = async function () {
  return new Promise((resolve, reject) => {
    console.log('starting first long running process')
    resolve('hi')
    ipc.send('something-to-frontend', 'done with first long running process!')
  })
}

handlers['start-second-long-running-process'] = async function () {
  return new Promise((resolve, reject) => {
    console.log('starting second long running process')
    resolve()
  })
}

module.exports = handlers
