import {promises} from 'fs';
import { exec} from 'child_process';
import {readdir} from 'node:fs/promises'
import {join} from 'node:path'

const deepReadDir = async (dirPath) => await Promise.all(
  (await readdir(dirPath, {withFileTypes: true})).map(async (dirent) => {
    const path = join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
  }),
)
function execPromise(command) {
  return new Promise(function(resolve, reject) {
      exec(command, (error, stdout, stderr) => {
          if (error) {
              reject(error);
              return;
          }

          resolve(stdout.trim());
      });
  });
}

deepReadDir(process.cwd())
  .then(async(nonFlatFileArrays) => {
    const files = nonFlatFileArrays.flat(Number.POSITIVE_INFINITY)
    console.log(files)
    if (!files.toString().includes(".next") || !files.toString().includes("dist")) {
      console.log("Shame on you, you didn't compile builds before building this Dockerfile, enjoy the INCREASED image size and build times.")
      const stdoutInstall = await execPromise(`NODE_ENV=development HUSKY=0 CYPRESS_INSTALL_BINARY=0 pnpm install`)
      console.log(`stdout for Install step: ${stdoutInstall}`);
      const stdoutBuild = await execPromise(`NODE_ENV=production pnpm build -r`)
      console.log(`stdout for Build step: ${stdoutBuild}`)

    }
    else { 
      console.log("Using detected precompiled builds, woo!")
    }
  })
