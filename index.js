#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const stripAnsi = require('strip-ansi');

const backOption = chalk.inverse('../');
const menuOptions = {
    file: ["do", "back"],
    directory: ["open", "do", "back"]
};


module.exports = class FileSystemExplorerUI {
    constructor(startPath) {
        this.root = process.cwd();
        this.startPath = startPath ? path.normalize(startPath) : this.root;
        this._currPath = this.startPath;
        this._targetPath = '';
        this.resolve = null;
    }

    surf() {
        return new Promise(resolve => {
            this.resolve = resolve;
            this.showDirList();
        })
    }

    showDirList() {
        console.log('\x1Bc');

        const dirList = this.currDirList;
        inquirer.prompt({
            type: 'list',
            name: 'target',
            message: this.currPath,
            choices: dirList,
            pageSize: 30,
            prefix: chalk.magenta('Current Dir:')
        }).then(choice => {
            if (choice.target === backOption) {
                this.currPath = this.currPath.split(path.sep).slice(0, -1).join(path.sep);
                this.showDirList()
            } else {
                this.targetPath = path.join(this.currPath, choice.target);
                this.showMenu();
            }
        })
    }

    showMenu() {
        console.log('\x1Bc');

        inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: this.targetPath,
            choices: this.menu,
            pageSize: 30,
            prefix: chalk.magenta(`Current ${this.targetType}:`)
        }).then(choice => {
            if (choice.menu === 'open') {
                this.currPath = this.targetPath;
                this.showDirList();
            }

            if (choice.menu === 'back') {
                this.showDirList();
            }

            if (choice.menu === 'do') {
                this.resolve(this.targetPath);
            }
        })
    }

    get currPath() {
        return this._currPath;
    }

    set currPath(value) {
        this._currPath = stripAnsi(value)
    }

    get targetPath() {
        return this._targetPath;
    }

    set targetPath(value) {
        this._targetPath = stripAnsi(value)
    }

    get targetType() {
        if (fs.statSync(this.targetPath).isFile())
            return 'file';

        if (fs.statSync(this.targetPath).isDirectory())
            return 'directory';

        console.error('Unknown file type!');
    }

    get menu() {
        return menuOptions[this.targetType];
    }

    get currDirList() {
        let list = fs.readdirSync(this.currPath);

        /** Styling DirList **/
        list = list.map(dir => {
            // Styling ignore files (node_modules || all files which first symbol is dot)
            if (dir === 'node_modules' || /^\..*/.test(dir))
                return chalk.gray(dir);

            let dirPath = path.join(this.currPath, dir);

            // Styling Dir or File list item
            if (fs.lstatSync(dirPath).isDirectory())
                return chalk.yellow(dir);

            // Styling Dir or File list item
            if (fs.lstatSync(dirPath).isFile())
                return chalk.bold(dir);

            return dir
        });

        list.sort((a, b) => {
            if (a < b)
                return 1;
            if (a > b)
                return -1;
            return 0
        });

        if (this.currPath === this.root)
            return list;

        list.unshift(backOption);
        return list;
    }
};