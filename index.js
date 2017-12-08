const fs = require('fs');
const readline = require('readline');
const inquirer = require('inquirer');


class fsUIExplorer {
	constructor(options) {
		this.root = options.root;
		this.do = options.do;
		this.currPath = this.root;
	}

	readDir() {
		// clear
		console.log('\x1Bc');
		
		this.currDirList = fs.readdirSync(this.currPath);
		// Add parent dir to currDirList if you not been in root dir
		if (this.currPath.split('\\')[this.currPath.split('\\').length - 2] !== this.root.split('\\')[0]) {
			this.currDirList.unshift(new inquirer.Separator('- - - - - - - -'));			
			this.currDirList.unshift(this.currPath.split('\\')[this.currPath.split('\\').length - 2]);			
		}

		const promptList = {
			type: 'list',
			name: 'next',
			message: this.currPath,
			choices: this.currDirList,
			pageSize: 30
		}

		inquirer.prompt(promptList)
		.then(answer => {
			// parent
			if (answer.next === this.currDirList[0]) {
				let parrentPath = this.currPath.split('\\');
				parrentPath.pop();
				this.currPath = parrentPath.join('\\');
			} else { // child
				this.currPath += `\\${answer.next}`;
			}
		})
		.then(() => this.readDir());		
	}

	run() {
		// clear
		console.log('\x1Bc');

		
		// readline.emitKeypressEvents(process.stdin);
		// process.stdin.setRawMode(true);
		// process.stdin.on('keypress', (str, key) => {
		// 	if (key.ctrl && key.name === 'c') {
		// 		process.exit(0);
		// 	} else {
		// 		// console.log(`You pressed the "${str}" key`);
		// 		// console.log();
		// 		// console.log(key);
		// 		// console.log();
		// 		if (key.name === 'right') this.menu();		
		// 		// if (key.name === 'left') this.readDir();	
		// 	}
		// });

		const rootDirList = {
			type: 'list',
			name: 'next',
			message: this.root,
			choices: fs.readdirSync(this.root),
			pageSize: 30
		}

		inquirer.prompt(rootDirList)
		.then(answer => {
			this.currPath += '\\' + answer.next; 
		})
		.then(() => this.readDir());		
	}

	menu() {
		console.log('MENU\n', this.currPath)
	}

	style() {
		
	}
}

new fsUIExplorer({
	root: __dirname,
	do: file => console.log(file)
}).run()
