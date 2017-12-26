const fsui = require('./index');

new fsui({
    message: 'test',
    isolate: true
}).then(res => console.log('file/dir ', res));
