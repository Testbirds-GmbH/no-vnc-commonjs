#!/usr/bin/env node

const path = require('path');
const del = require('del');
const util = require('./util');

const paths = {
  module: './no-vnc',
  generatedFolder: 'lib',
  targetFolder: './dist',
  scriptsFolder: './scripts'
};

util.setupStep(1, 6);

util.printTitle('Build script for noVNC commonjs compilation');
util.printStep('Git init submodule');
util.run(`git submodule init ${paths.module}`)
  .then(() => {
    util.printStep('Git update submodule');
    return util.run(`git submodule update ${paths.module}`);
  })
  .then(() => {
    util.printStep('NPM install');
    return util.run('yarn install', {cwd: paths.module});
  })
  .then(() => {
    util.printStep('Build requirejs files');
    util.printSubStep('Secure original no-vnc script');
    return util.copy(path.join(paths.module, 'utils', 'use_require.js'), path.join(paths.module, 'utils', 'old_use_require.js'));
  })
  .then(() => {
    util.printSubStep('Copy script to no-vnc');
    return util.copy(path.join(paths.scriptsFolder, 'convert.js'), path.join(paths.module, 'utils', 'use_require.js'));
  })
  .then(() => {
    util.printSubStep('Run build')
    return util.run('npm run prepublish', {cwd: paths.module});
  })
  .then(() => {
    util.printSubStep('Restore original script');
    return util.rename(path.join(paths.module, 'utils', 'old_use_require.js'), path.join(paths.module, 'utils', 'use_require.js'));
  })
  .then(() => {
    util.printStep('Removing current files');
    return del(`${paths.targetFolder}/**`);
  })
  .then(() => {
    util.printStep('Copy generated files');
    return util.copy(path.join(paths.module, paths.generatedFolder), paths.targetFolder);
  })
  .then(()=> {
    util.printTitle('Build finished');
  });



