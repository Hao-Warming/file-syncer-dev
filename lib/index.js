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
        const result = this.config.find(item => sourceFile.includes(item.key));
        if (result) {
            const index = sourceFile.indexOf(result.key);
            const pureFile = sourceFile.substring(index + result.key.length);
            const targetFile = path.resolve(result.target, pureFile);

            const tempArr = result.key.split(path.sep);
            const changeFolder = tempArr[tempArr.length - 1];

            if (evt === 'update') {
                fse.copySync(sourceFile, targetFile);
            } else if (evt === 'remove') {
                fse.removeSync(targetFile);
            }
            console.log(this.getTime(), evt, changeFolder, targetFile);
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
        chokidar.watch(this.watchFolders, {
            ignoreInitial: true,
        }).on('add', filePath => this.callback('update', filePath))
            .on('change', filePath => this.callback('update', filePath))
            .on('unlink', filePath => this.callback('remove', filePath))
            .on('ready', () => console.log('正在监听文件改动...'));
    }
}

module.exports = FileSync;
