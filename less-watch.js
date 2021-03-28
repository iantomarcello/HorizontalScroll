/**
 * Watches and compiles LESS
 * @author Ian Yong (iantomarcello)
 */

import chokidar from 'chokidar';
import less from 'less';
import fs from 'fs';

/**
 * File Object 
 * @property {String} change, the file which is watched for changes.
 * @property {String} input, the .less file which is the input for less.render. Omitting it sets to the value of `change`.
 * @property {String} output, the .css file which is the output for less compilation.
 */

const files = [
  { change: 'style.less', output: 'public/style.min.css' },
];


/**
 * Renders the .less file to .css
 * @param {Object} file object item in `files`
 */

function lessrender(file) {
  file.input = file.input ?? file.change;
  let lessInput = fs.readFileSync(file.input, { encoding: 'utf-8' });
  less.render(lessInput, { compress: true, javascriptEnabled: true, })
    .then((lessOutput, err) => {
      if ( err ) return console.log(err);
      fs.writeFileSync(file.output, lessOutput.css);
      console.log('\x1b[32m%s\x1b[0m', `${file.input} compiled to ${file.output}.`);        
    }).catch(console.log);
}


/**
 * Begin the watch.
 */

chokidar.watch( files.map(f => f.change) )
  .on('ready', () => {
    console.log('LESS watch ready.');
    files.forEach(lessrender);
  })
  .on('change', (filePath) => {
    console.log('LESS compiling:');
    let url = filePath.replace('\\', '/');
    let inputFiles = files.filter(f => f.change === url);
    inputFiles.forEach(lessrender);
  })
;