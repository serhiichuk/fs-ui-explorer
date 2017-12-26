# (fs-explorer-ui) Node Terminal File Explorer

A simple package for exploring directories in terminal around your project.

![](/src/preview.gif)

### Install
```javascript
$ npm install fs-explorer-ui
```
### Usage
`Promise`
```javascript
const fsExplorerUI = require('fs-explorer-ui');

new fsExplorerUI({
	startPath: 'D:/your/path',
	message: 'This message will displayed above folder list',
	isolate: true
}).then(yourPath => { // Promise, return absolute path of the selected file/directory
    console.log('You choose file/directory', yourPath)
});
```

`async, await`
```javascript
async function example() {
    const yourPath = await new fsExplorerUI({
    	startPath: 'D:/your/path',
    	message: 'This message will displayed above folder list',
    	isolate: true
    });
};
```

### Options
<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Default Value</th>
      <th>Description</th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <th>startPath</th>
      <td>process.cwd()</td>
      <td>Absolute path from which you start browsing the folders.</td>
    </tr>
    <tr>
      <th>message</th>
      <td>undefined</td>
      <td>Message that will be displayed above the folder structure.</td>
    </tr>
    <tr>
      <th>isolate</th>
      <td>false</td>
      <td>Set 'true' if you want to forbid going beyond 'startPath'</td>
    </tr>
  </tbody>
</table>


This is [on GitHub](https://github.com/serhiichuk/fs-ui-explorer) so let me know if I've broken it somewhere.
