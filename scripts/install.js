#!/usr/bin/env node

const path = require('path');
const copy = require('ncp').ncp;
const del = require('del');
const util = require('./util');
const modulePath = './no-vnc';
const generatedFolder = 'lib';
const targetFolder = './dist';

util.setupStep(1, 6);

util.printTitle('Build script for noVNC commonjs compilation');
util.printStep('Git init submodule');
util.run(`git submodule init ${modulePath}`)
  .then(() => {
    util.printStep('Git update submodule');
    return util.run(`git submodule update ${modulePath}`);
  })
  .then(() => {
    util.printStep('NPM install');
    return util.run('npm install', {cwd: modulePath});
  })
  .then(() => {
    util.printStep('Build requirejs files');
    return util.run('npm run prepublish', {cwd: modulePath});
  })
  .then(() => {
    util.printStep('Removing current files');
    return del(`${targetFolder}/**`);
  })
  .then(() => {
    util.printStep('Copy generated files');
    return new Promise((resolve, reject) => {
      copy(path.join(modulePath, generatedFolder), targetFolder, (error) => {
        if(error){
          reject(error);
        }

        resolve(true);
      });
    })
  })
  .then(()=> {
    util.printTitle('Build finished');
  });



