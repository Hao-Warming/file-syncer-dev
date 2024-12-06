#!/usr/bin/env node

const { Command } = require('commander');
const FileSync = require('../lib/index');
const path = require('path');
const fse = require('fs-extra');

const program = new Command();
const configPath = path.resolve(process.cwd(), 'filesync.config.js');

let fileConfig;
try {
    fileConfig = require(configPath);
} catch (error) {
    console.error(`Configuration file not found: ${configPath}`);
    console.error('Please ensure a filesync.config.js file is created in the project root directory.');
    process.exit(1);
}

const fileSync = new FileSync(fileConfig);

program
    .name('filesync')
    .description('A tool to sync and watch files based on configuration')
    .version('1.0.0');

program
    .command('watch')
    .description('Start watching files')
    .action(() => {
        fileSync.watchFileChange();
    });

program
    .command('sync <keys...>')
    .description('Sync specified directories by keys')
    .action((keys) => {
        keys.forEach(syncFolder);
    });

program.parse(process.argv);

function syncFolder(key) {
    key = key.trim();
    const item = fileSync.config.find(it => it.key.replace(path.sep, '/') === key);
    if (item) {
        fse.removeSync(item.target);
        fileSync.onFileChange('update', item.source);
    } else {
        console.error(`Cannot find key: ${key} in the config.`);
    }
}
