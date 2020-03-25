var ipc = window.middlewareClient

ipc.send('start-second-long-running-process', function (err) {
  if (err) console.error(err)
  console.log('done!')
})

ipc.on('something-to-frontend', function (arg) {
  console.log('got thing!', arg)
})
