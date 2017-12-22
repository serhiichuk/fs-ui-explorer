# (fs-explorer-ui) Node Terminal File Explorer

A simple package for exploring directories in terminal around your project.

![](/src/preview.gif)

### Install
```javascript
$ npm install fs-explorer-ui
```
### Usage

```javascript
const FileSystemExplorerUI = require('fs-explorer-ui');

new FileSystemExplorerUI('D:/your/path') // optional default it's process.cwd()
    .surf()
    .then(filePath => { // Promise return absolute path of the selected file
        console.log('You choose file', filePath)
    });
```
##### Note!
You can explore only your project directories

This is [on GitHub](https://github.com/serhiichuk/fs-ui-explorer) so let me know if I've broken it somewhere.
