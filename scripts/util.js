#!/usr/bin/env node

const fs = require('fs');
const ncp = require('ncp').ncp;
const exec = require('child_process').exec;
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  sim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

let currentStep = 0;
let totalSteps = 0;

let printTitle = (message) => console.log(`${colors.bgGreen}${colors.fgBlack}%s${colors.reset}`, `========= ${message} =========`);
let printStep = (message) => console.log(`${colors.fgCyan}%s${colors.reset}`, `[${currentStep++}|${totalSteps}] ${message}`);
let printSubStep = (message) => console.log(`${colors.fgCyan} - ${colors.fgYellow}%s${colors.reset}`, `${message}`);
let setupStep = (current, total) => {
  currentStep = current;
  totalSteps = total;
};

let run = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      if (stdout) console.log(`stdout: ${stdout}`);
      if (stderr) console.log(`stderr: ${stderr}`);
      resolve(stdout || stderr || null);
    });
  });
};

let copy = (source, target) => {
  return new Promise((resolve, reject) => {
    ncp(source, target, (error) => {
      if (error) {
        reject(error);
      }

      resolve(true);
    });
  });
};

let del = (target) => {
  return new Promise((resolve, reject) => {
    fs.unlink(target, (error) => {
      if (error) {
        reject(error);
      }

      resolve(true);
    })
  });
};

let rename = (source, target) => {
  return new Promise((resolve, reject) => {
    fs.rename(source, target, (error) => {
      if (error) {
        reject(error);
      }

      resolve(true);
    })
  });
};

module.exports = {
  setupStep: setupStep,
  printTitle: printTitle,
  printStep: printStep,
  printSubStep: printSubStep,
  run: run,
  colors: colors,
  copy: copy,
  del: del,
  rename: rename
};