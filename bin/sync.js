#!/usr/bin/env node

const { Command } = require('commander');
const FileSync = require('../lib/index');
const path = require('path');
const fse = require('fs-extra');
const packageJson = require('../package.json');
const readline = require('readline');

const program = new Command();
const configPath = path.resolve(process.cwd(), 'filesync.config.js');

let fileConfig;
const loadConfig = () => {
    try {
        fileConfig = require(configPath);
    } catch (error) {
        console.error(`Configuration file not found: ${configPath}`);
        console.error('Please ensure a filesync.config.js file is created in the project root directory.');
        process.exit(1);
    }
};

let fileSync;
program
    .name('filesync-dev')
    .description('A tool to sync and watch files based on configuration')
    .version(packageJson.version)
    .helpOption('-h, --help', 'Display help for command');

program
    .command('watch')
    .description('Start watching files')
    .action(() => {
        loadConfig();
        fileSync = new FileSync(fileConfig);
        fileSync.watchFileChange();
    });

program
    .command('sync <keys...>')
    .description('Sync specified directories by keys')
    .action((keys) => {
        loadConfig();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('The entire directory will be deleted and replaced. Are you sure you want to continue? (yes/no) ', (answer) => {
            if (answer.toLowerCase() === 'yes') {
                fileSync = new FileSync(fileConfig);
                keys.forEach(syncFolder);
            } else {
                console.log('Sync operation cancelled.');
            }
            rl.close();
        });
    });

program
    .command('version')
    .description('Display the current version')
    .action(() => {
        console.log(`Current version: ${packageJson.version}`);
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
