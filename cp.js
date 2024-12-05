const path = require('path');
const readline = require('readline');
const chokidar = require('chokidar');
const fse = require('fs-extra');

/**
 *配置文件地方，如果不用的工程请暂时注释掉，避免监视文件过多
 * {
 *   key：唯一标志，项目名+文件夹名
 *   source：源目标文件夹，
 *   target：订货通小程序对应的文件夹
 * }
 * 完全文档请参考：https://git.firstshare.cn/fe-tools/code-sync
 */
const config = [
    // {
    //   key: 'src/services',
    //   source: path.join(__dirname, './src/services'),
    //   target: path.join(__dirname, './src/miniprogram_npm/dht-services'),
    // },
    // {
    //   key: 'src/components',
    //   source: path.join(__dirname, './src/components'),
    //   target: path.join(__dirname, './src/miniprogram_npm/dht-components'),
    // },
    // {
    //   key: 'object_list/object_list_main',
    //   source: path.join(__dirname, '../object_list/object_list_main'),
    //   target: path.join(__dirname, './src/object_list_main'),
    // },
    {
        key: 'object_list/object_list_sfa_o2c',
        source: path.join(__dirname, '../object_list/object_list_sfa_o2c'),
        target: path.join(__dirname, './src/object_list_sfa_o2c'),
    },
    {
        key: 'object_list/object_list',
        source: path.join(__dirname, '../object_list/object_list'),
        target: path.join(__dirname, './src/object_list'),
    },
    {
        key: 'object_detail/object_detail',
        source: path.join(__dirname, '../object_detail/object_detail'),
        target: path.join(__dirname, './src/object_detail'),
    },
    // {
    //   key: 'object_form_pass/objformpkgo2c',
    //   source: path.join(__dirname, '../object_form_pass/objformpkgo2c'),
    //   target: path.join(__dirname, './src/objformpkgo2c'),
    // },
    {
        key: 'object_form_pass/objformplugin-salesorder-dht',
        source: path.join(__dirname, '../object_form_pass/objformplugin-salesorder-dht'),
        target: path.join(__dirname, './src/objformplugin-salesorder-dht'),
    },
    // {
    //   key: 'object_form_pass/objformpkgbiz',
    //   source: path.join(__dirname, '../object_form_pass/objformpkgbiz'),
    //   target: path.join(__dirname, './src/objformpkgbiz'),
    // },
    // {
    //   key: 'object_form_pass/objformpkgbase',
    //   source: path.join(__dirname, '../object_form_pass/objformpkgbase'),
    //   target: path.join(__dirname, './src/objformpkgbase'),
    // },
    // {
    //   key: 'object_form_pass/objformpkgl2o',
    //   source: path.join(__dirname, '../object_form_pass/objformpkgl2o'),
    //   target: path.join(__dirname, './src/objformpkgl2o'),
    // },
    // {
    //   key: 'object_form_pass/objformmain',
    //   source: path.join(__dirname, '../object_form_pass/objformmain'),
    //   target: path.join(__dirname, './src/objformmain'),
    // },
    // {
    //   key: 'uipaas_custom/uipaasframe',
    //   source: path.join(__dirname, '../uipaas_custom/uipaasframe'),
    //   target: path.join(__dirname, './src/uipaasframe'),
    // },
    // {
    //   key: 'uipaas_custom/uipaascustompackage',
    //   source: path.join(__dirname, '../uipaas_custom/uipaascustompackage'),
    //   target: path.join(__dirname, './src/uipaascustompackage'),
    // },
    {
        key: 'src/services',
        source: path.join(__dirname, './src/services'),
        target: path.join(__dirname, '../uipaas_custom/miniprogram_npm/dht-services'),
    },
    // {
    //   key: 'business-cmpt-paas/business-cmpt-paas-sub',
    //   source: path.join(__dirname, '../business-cmpt-paas/business-cmpt-paas-sub'),
    //   target: path.join(__dirname, './src/business-cmpt-paas-sub'),
    // },
    // {
    //   key: 'business-cmpt-paas/business-cmpt-paas-main',
    //   source: path.join(__dirname, '../business-cmpt-paas/business-cmpt-paas-main'),
    //   target: path.join(__dirname, './src/business-cmpt-paas-main'),
    // },
    // {
    //   key: 'ava-fs-common/fs_common',
    //   source: path.join(__dirname, '../ava-fs-common/fs_common'),
    //   target: path.join(__dirname, './src/fs_common'),
    // },
    // {
    //   key: 'ava_ui/package',
    //   source: path.join(__dirname, '../ava_ui/package'),
    //   target: path.join(__dirname, './src/miniprogram_npm/ava-ui'),
    // },
];

const queues = [];
const watchFolders = config.map(item => item.source);
config.forEach(item => {
    item.key = item.key.replace('/', path.sep);
});

function getTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function onFileChange(evt, sourceFile) {
    const result = config.find(item => sourceFile.includes(item.key));
    if (result) {
        const index = sourceFile.indexOf(result.key);
        const pureFile = sourceFile.substring(index + result.key.length);
        const targetFile = path.join(result.target, pureFile);

        const tempArr = result.key.split(path.sep);
        const changeFolder = tempArr[tempArr.length - 1];

        if (evt === 'update') {
            fse.copySync(sourceFile, targetFile);
        } else if (evt === 'remove') {
            fse.removeSync(targetFile);
        }
        console.log(getTime(), evt, changeFolder, targetFile);
    }
}

function handleOnChange() {
    while (queues.length) {
        const { evt, file } = queues.pop();
        try {
            if (evt === 'remove') {
                onFileChange(evt, file);
            } else if (evt === 'update') {
                onFileChange(evt, file);
            }
        } catch (e) {
            console.warn(e);
        }
    }
}

function callback(evt, file) {
    if (queues.length) {
        queues.unshift({ evt, file });
    } else {
        queues.unshift({ evt, file });
        handleOnChange();
    }
}

function watchFileChange() {
    chokidar.watch(watchFolders, {
        ignoreInitial: true,
    }).on('add', filePath => callback('update', filePath))
        .on('change', filePath => callback('update', filePath))
        .on('unlink', filePath => callback('remove', filePath))
        .on('ready', () => console.log('正在监听文件改动...'));
}

function syncFolder(key) {
    key = key.trim();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('将删除并替换整个目录，确定继续吗y/N？', (input) => {
        if (input.trim() === 'y' || input.trim() === 'Y') {
            const item = config.find(it => it.key.replace(path.sep, '/') === key);
            if (item) {
                // 先删除后复制
                fse.removeSync(item.target);
                onFileChange('update', item.source);
            } else {
                throw new Error(`can not find key:${key} in the config.`);
            }
        }
        rl.close();
    });
}

const folderName = process.argv[2];

if (folderName) {
    // 处理单个子包
    syncFolder(folderName);
} else {
    // 监视文件
    watchFileChange();
}
