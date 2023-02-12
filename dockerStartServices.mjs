import {execa} from 'execa';


if (process.env.CI) {
  console.log('Not starting any Docker containers, CI mode is activated.')
}
else {
  execa('docker', ['compose', 'up', 'cache', '-d'])
  .stderr.pipe(process.stderr)
}