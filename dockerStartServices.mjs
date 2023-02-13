

if (process.env.CI) {
  console.log('Not starting any Docker containers, CI mode is activated.')
}
else {
  import('execa')
  .then((module) => {
    module.execa('docker', ['compose', 'up', 'cache', '-d'])
    .stderr.pipe(process.stderr)
  })
}