# file-syncer-dev

<details>
<summary>中文说明</summary>

## 功能

- **实时文件同步**：自动将文件从源目录同步到目标目录。
- **可定制的配置**：轻松配置需要同步的目录。

## 安装

### 本地安装

在你的项目中，可以用以下方法来安装 file-syncer-dev 命令行工具：

```bash
npm install -D file-syncer-dev
```

### 全局安装

```bash
npm install -g file-syncer-dev
```

安装后，你可以在任意项目中直接使用 filesync-dev 命令。

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
npx filesync-dev watch  # 只安装在项目

# or

filesync-dev watch # 已全局安装
```

这将开始监控指定的目录，并实时同步任何更改。

### 使用 `sync` 和 `watch` 命令

- **sync**：使用 `<npx> filesync-dev sync <keys...>` 命令手动同步指定的目录。此命令将立即将源目录中的所有文件复制到目标目录。
- **watch**：使用 `<npx> filesync-dev watch` 命令启动文件监控模式。此模式下，任何源目录中的更改都会自动同步到目标目录。

## 许可证

此项目根据 MIT 许可证授权。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 联系

如有任何问题或需要支持，请联系 wangmh0910@gmail.com。

</details>

<details open>
<summary>English Description</summary>

## Features

- **Real-time File Syncing**: Automatically syncs files from source to target directories.
- **Customizable Configuration**: Easily configure which directories to sync.

## Installation

### Local Installation

In your project, you can install the file-syncer-dev command line tool as follows:

```bash
npm install -D file-syncer-dev
```

### Global Installation

```bash
npm install -g file-syncer-dev
```

After installation, you can use the `filesync-dev` command in any project.

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
npx filesync-dev watch  # For local installation

# or

filesync-dev watch # For global installation
```

This will begin monitoring the specified directories and sync any changes in real-time.

### Using `sync` and `watch` Commands

- **sync**: Use the `<npx> filesync-dev sync <keys...>` command to manually sync specified directories. This command will immediately copy all files from the source to the target directories.
- **watch**: Use the `<npx> filesync-dev watch` command to start the file monitoring mode. In this mode, any changes in the source directories will be automatically synced to the target directories.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or support, please contact wangmh0910@gmail.com.

</details>