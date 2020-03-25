# electron-rabbit

Inter-process communication for electron to speed up your apps.

## Setup

See `example/app.js` for a working example.

In short, include background.js in a `<script>` tag in your `background.html`.
```js
const serverHandlers = require('./my-app-ipc')
const rabbit = require('electron-rabbit')
const { ipcRenderer } = require('electron')

ipcRenderer.on('set-socket', (event, { name }) => {
  rabbit.init(name, serverHandlers)
})
```

Include client-preload.js in the `preload` of your client window.
```js
const rabbit = require('electron-rabbit')

window.middlewareClient = new rabbit.Client()
ipcRenderer.on('set-socket', (event, { name }) => {
  window.middlewareClient.connect(name)
})
```

## Usage 

### Client -> Background -> Client

Send ipc messages from the frontend to the background window
process and get a callback when complete.

`example/my-app-ipc.js`
```js
var handlers = {}
handlers['start-a-long-running-process'] = async function () {
  return new Promise((resolve, reject) => {
    console.log('starting second long running process')
    resolve()
  })
}
module.exports = handlers
```

`client.js`
```js
var ipc = window.middlewareClient

ipc.send('start-a-long-running-process', 'my-argument', function (err) {
  if (err) console.error(err)
  console.log('second long running process done!')
})
```

### Background -> Client

Send messages asyncrously from the background window to the client.

`example/my-app-ipc.js`
```js
const ipc = require('electron-rabbit')
ipc.send('something-to-frontend', 'done with first long running process!')
```

`client.js`
```
var ipc = window.middlewareClient
ipc.on('something-to-frontend', function (arg) {
  console.log('got thing! now i'm re-rendering', arg)
})
```

## API

### ```client = electron-rabbit.Client()```

Create a client api that can interact with the background ipc. This client can
be created in the electron main or renderer processes.

Example usage
```js
var client = new rabbit.Client()
client.connect(socketName)
ipc.send('start-second-long-running-process', 'my-argument', function (err) {
  if (err) console.error(err)
  console.log('second long running process done!')
})

ipc.on('something-to-frontend', function (arg) {
  console.log('got thing!', arg)
})
```

Messages are kept in a queue which is drained once a connection is established.

### ```electron-rabbit.init(socketName, handlers)```

Create the background ipc handlers. 

Arguments:

* socketName: string
* handlers: Object of String -> Handler. Handler should be an asyncronous function that returns a Promise.

### ```electron-rabbit.send(name, args)```

Send an event with the given name and arguments from the background to the
client.

### ```electron-rabbit.findOpenSocket(namespace)```

Finds you an open socket if you're having more than one
application instance or ipc instance open at the same time.

## Credit

Inspired by https://github.com/jlongster/electron-with-server-example

# License

MIT
