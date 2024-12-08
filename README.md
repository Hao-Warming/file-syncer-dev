# file-syncer-dev

一个用于开发者在开发过程中高效同步和监控文件的 Node.js 工具，确保无缝更新并提高生产力。

## 功能

- **实时文件同步**：自动将文件从源目录同步到目标目录。
- **可定制的配置**：轻松配置需要同步的目录。

## 安装

安装必要的依赖项，请运行以下命令：

```bash
npm install
```

## 配置

在项目的根目录中创建一个 `filesync.config.js` 文件，以指定要同步的目录。以下是一个示例配置：

```js
const path = require('path');

module.exports = [
    {
        key: 'services',
        source: path.join(__dirname, './services'),
        target: path.join(__dirname, './dist/services')
    },
    {
        key: 'components',
        source: path.join(__dirname, './src/components'),
        target: path.join(__dirname, './dist/components')
    }
];
```

### 配置详情

- **key**：每个同步配置的唯一标识符。在使用命令行时用于指定要同步的目录。
- **source**：文件所在的源目录路径。此目录中的更改将触发同步。
- **target**：文件将被复制到的目标目录路径。这是同步文件的目的地。

## 使用

要启动文件同步器，请使用以下命令：

```bash
npm start
```

这将开始监控指定的目录，并实时同步任何更改。


## 许可证

此项目根据 MIT 许可证授权。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 联系

如有任何问题或需要支持，请联系 wangmh0910@gmail.com。

---

# file-syncer-dev

A Node.js tool for developers to efficiently sync and monitor files during development, ensuring seamless updates and boosting productivity.

## Features

- **Real-time File Syncing**: Automatically syncs files from source to target directories.
- **Customizable Configuration**: Easily configure which directories to sync.

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

## Configuration

Create a `filesync.config.js` file in the root directory of your project to specify the directories you want to sync. Here is an example configuration:

```js
const path = require('path');

module.exports = [
    {
        key: 'services',
        source: path.join(__dirname, './services'),
        target: path.join(__dirname, './dist/services')
    },
    {
        key: 'components',
        source: path.join(__dirname, './src/components'),
        target: path.join(__dirname, './dist/components')
    }
];
```

### Configuration Details

- **key**: A unique identifier for each sync configuration. It is used to specify which directories to sync when using the command line.
- **source**: The source directory path where the files are located. Changes in this directory will trigger a sync.
- **target**: The target directory path where the files will be copied to. This is the destination for the synced files.

## Usage

To start the file syncer, use the following command:

```bash
npm start
```

This will begin monitoring the specified directories and sync any changes in real-time.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or support, please contact wangmh0910@gmail.com.
