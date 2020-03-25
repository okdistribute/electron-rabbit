var ipc = window.middlewareClient

ipc.send('start-second-long-running-process', 'my-argument', function (err) {
  if (err) console.error(err)
  console.log('second long running process done!')
})

ipc.on('something-to-frontend', function (arg) {
  console.log('got thing!', arg)
})
