import {execa} from 'execa';


// For more consistent behavior, our CI starts a Redis container independently of our Docker-Compose
if (process.env.CI) {
  console.log('Not starting any Docker containers, CI mode is activated.')
}
else {
  execa('docker', ['compose', 'up', 'cache', '-d'])
  .stderr.pipe(process.stderr)
}