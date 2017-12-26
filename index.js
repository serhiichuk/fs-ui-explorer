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
    constructor(options) {
        this.root = process.cwd();
        this.startPath = options.startPath ? path.normalize(options.startPath) : this.root;
        this.message = options.message;
        this.isolate = options.isolate || false;
        this._currPath = this.startPath;
        this._targetPath = '';
        this.resolve = null;

        return new Promise(resolve => {
            this.resolve = resolve;
            this.showDirList();
        })
    }

    showDirList() {
        this.onRefreshUI();

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
        this.onRefreshUI();

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

    onRefreshUI() {
        console.log('\x1Bc');
        if (this.message) console.log(this.message);
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
        const isDiskRoot = path.parse(this.currPath).root === path.parse(this.currPath).dir;
        let list = fs.readdirSync(this.currPath);

        /** Styling DirList **/
        list = list.map(dir => {
            // Styling ignore files (node_modules || all files which first symbol is dot)
            if (dir === 'node_modules' || /^\..*/.test(dir))
                return chalk.gray(dir);

            let dirPath = path.join(this.currPath, dir);

            // Styling Dir or File list item
            if (fs.lstatSync(dirPath).isDirectory())
                return chalk.yellowBright(dir);

            // Styling Dir or File list item
            if (fs.lstatSync(dirPath).isFile())
                return chalk.whiteBright(dir);

            return dir
        });

        /** Folders to top **/
        list.sort();

        /** Without Back Option ('../') **/
        if (this.currPath === this.startPath && this.isolate || isDiskRoot) return list;

        /** Add Back Option ('../') **/
        list.unshift(backOption);
        return list;
    }
};