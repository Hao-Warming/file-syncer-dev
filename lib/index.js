const chokidar = require('chokidar');
const fse = require('fs-extra');
const path = require('path');

class FileSync {
    constructor(config) {
        this.config = config;
        this.queues = [];
        this.watchFolders = config.map(item => path.resolve(item.source));
    }

    getTime() {
        const date = new Date();
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    onFileChange(evt, sourceFile) {
        const result = this.config.find(item => sourceFile.startsWith(item.source));
        if (result) {
            const relativePath = path.relative(result.source, sourceFile);
            const targetFile = path.resolve(result.target, relativePath);

            if (sourceFile === targetFile) {
                console.log('Source and target are the same, skipping copy.');
                return;
            }

            if (evt === 'update') {
                fse.copySync(sourceFile, targetFile);
            } else if (evt === 'remove') {
                fse.removeSync(targetFile);
            }
            console.log(this.getTime(), evt, result.key, targetFile);
        } else {
            console.log(`No matching config found for sourceFile: ${sourceFile}`);
        }
    }

    handleOnChange() {
        while (this.queues.length) {
            const { evt, file } = this.queues.pop();
            try {
                this.onFileChange(evt, file);
            } catch (e) {
                console.warn(e);
            }
        }
    }

    callback(evt, file) {
        if (this.queues.length) {
            this.queues.unshift({ evt, file });
        } else {
            this.queues.unshift({ evt, file });
            this.handleOnChange();
        }
    }

    watchFileChange() {
        let isReadyLogged = false;
        if (this.watcher) {
            this.watcher.close();
        }
        this.watcher = chokidar.watch(this.watchFolders, {
            ignoreInitial: true,
        });

        this.watcher.on('add', filePath => this.callback('update', filePath))
            .on('change', filePath => this.callback('update', filePath))
            .on('unlink', filePath => this.callback('remove', filePath))
            .on('ready', () => {
                if (!isReadyLogged) {
                    console.log('Watching file changes...');
                    isReadyLogged = true;
                }
            });

        if (this.configWatcher) {
            this.configWatcher.close();
        }
        this.configWatcher = chokidar.watch(path.resolve(process.cwd(), 'filesync.config.js'), {
            ignoreInitial: true,
        });

        this.configWatcher.on('change', () => {
            console.log('Configuration file changed, reloading...');
            this.reloadConfig();
            this.watchFileChange();
        });
    }

    reloadConfig() {
        delete require.cache[require.resolve(path.resolve(process.cwd(), 'filesync.config.js'))];
        this.config = require(path.resolve(process.cwd(), 'filesync.config.js'));
        this.watchFolders = this.config.map(item => path.resolve(item.source));
    }
}

module.exports = FileSync;
