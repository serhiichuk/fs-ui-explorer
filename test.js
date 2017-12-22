const fsui = require('./index');
const inquirer = require('inquirer');


new fsui()
    .surf()
    .then(res => {
        inquirer.prompt({
            type: 'confirm',
            name: 'ok',
            message: 'Your file path? \n  ' + res,
        }).then(choice => {
            console.log(choice.ok);
        });
    });
