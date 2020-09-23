const ipc = require('node-ipc')

function init (socketName, handlers) {
  ipc.config.id = socketName
  ipc.config.logger = console.log

  ipc.serve(() => {
    ipc.server.on('message', (data, socket) => {
      const msg = JSON.parse(data)
      const { id, name, args } = msg

      var onError = (error) => {
        console.warn('Error', name, args)
        console.error(error)
        // Up to you how to handle errors, if you want to forward
        // them, etc
        ipc.server.emit(
          socket,
          'message',
          JSON.stringify({ type: 'error', id, result: error.message })
        )
      }

      if (handlers[name]) {
        let promise
        try {
          promise = handlers[name](args)
        } catch (err) {
          onError(err)
        }

        promise.then(result => {
          ipc.server.emit(
            socket,
            'message',
            JSON.stringify({ type: 'reply', id, result })
          )
        }).catch(onError)
      } else {
        console.warn('Unknown method: ' + name)
        ipc.server.emit(
          socket,
          'message',
          JSON.stringify({ type: 'reply', id, result: null })
        )
      }
    })
  })

  ipc.server.start()
}

module.exports = init
