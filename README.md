# (fs-explorer-ui) Node Terminal File Explorer

A simple package for exploring directories in terminal around your project.

![](/src/preview.gif)

### Install
```javascript
$ npm install fs-explorer-ui
```
### Usage

```javascript
const feu = require('fs-explorer-ui');

// Default options
new feu({
    root: __dirname, // String, start path to explore
    do: file => console.log('Your File:', file) // Function, call if you choose file
}).run();
```
##### Note!
You can explore only your project directories

#### Related

 * [inquirer](https://github.com/SBoudrias/Inquirer.js) for parse directories
 * [strip-ansi](https://github.com/chalk/strip-ansi) for removing ANSI codes where necessary

This is [on GitHub](https://github.com/serhiichuk/fs-ui-explorer) so let me know if I've broken it somewhere.
