const fs = require('fs');
const inquirer = require('inquirer');
const stripAnsi = require('strip-ansi');

class fsUIExplorer {
    constructor(options = fsUIExplorer.getDefaultOptions()) {
        this.root = __dirname;
        this.do = options.do;
        this._currPath = options.root;
    }

    run() {
        // clear terminal
        console.log('\x1Bc');

        this.readDir();
    }

    readDir() {
        const path = this.currPath;
        const dirList = this.currDirList;
        const promptList = {
            type: 'list',
            name: 'next',
            message: path,
            choices: dirList,
            pageSize: 30
        };

        inquirer.prompt(promptList)
            .then(choice => {

                // Check if your choice is parent dir and you not been in root dir
                const isParent = choice.next === dirList[0];

                if (isParent && path !== this.root) {
                    let parrentPath = path.split('\\');
                    parrentPath.pop();
                    // go back dir
                    this.currPath = parrentPath.join('\\');
                } else {
                    // go next dir
                    this.currPath += stripAnsi(`\\${choice.next}`);
                }
            })
    }

    // currPath
    get currPath() {
        return this._currPath;
    }

    set currPath(value) {
        value = stripAnsi(value);

        /** Check if your choice is a Dir of File **/
        if (fs.lstatSync(value).isDirectory()) {
            // Dir
            this._currPath = value ;

            // clear terminal
            console.log('\x1Bc');
            this.readDir();
        } else {
            // File
            this.do(value)
        }



    }

    /** Get Current Directory List With Styling**/
    get currDirList() {
        let dirList = fs.readdirSync(this.currPath);
        const path = this.currPath;
        const rootDirName = this.root.split('\\').pop();
        const prevDirName = path.split('\\')[path.split('\\').length - 1];
        const isNextRootDir = prevDirName !== rootDirName;

        dirList = dirList.map(dir => {
            let dirPath = stripAnsi(`${path}\\${dir}`);

            // ignore files Styling (node_modules || all files which first symbol is dot)
            if (dir === 'node_modules' || /^\..*/.test(dir)) {
                return `\x1b[31m${dir}\x1b[0m`
            }
            /** Styling Dir or File list item **/
            if (fs.lstatSync(dirPath).isDirectory()) {
                // Directory Styling
                return `\x1b[32m${dir}\x1b[0m`
            } else {
                // File Styling
                return `\x1b[4m${dir}\x1b[0m`
            }
        });

        dirList.sort();

        // Add parent dir to currDirList if you not been in root dir
        if (isNextRootDir) dirList.unshift(`\x1b[7m${prevDirName}\x1b[0m`);

        return dirList;
    }

    static getDefaultOptions() {
        return {
            root: __dirname,
            do: file => console.log('Your File:', file)
        }
    }
}

module.exports = fsUIExplorer;