const ipc = require('node-ipc')

module.exports = {
  Client: require('./src/client-ipc'),
  findOpenSocket: require('./src/find-open-socket'),
  init: require('./src/background-ipc'),
  send: function (name, args) {
    ipc.server.broadcast('message', JSON.stringify({ type: 'push', name, args }))
  }
}
