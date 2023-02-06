// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { start } = require('repl');
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function findindex(b, r){
	var loc = -1;
	var length = 0;
	//vscode.window.showInformationMessage('blue in：'+ b + ', red in：'+ r);
	if (b == -1 && r== -1) {loc = -1;}
	else if(b == -1 && r != -1) {loc = r; length = 15;} 
	else if(b != -1 && r == -1) {loc = b; length = 16;}
	else{
		if(r < b){loc = r; length = 15;}
		else{loc = b; length = 16;}
	}
	return {'loc': loc, 'length': length};
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "add-color-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let givemeblue = vscode.commands.registerCommand('add-color-code.GiveMeBlueCMD', function () {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		vscode.window.showInformationMessage('Give You Blue!');
		let SnippetStr = new vscode.SnippetString("\\textcolor{blue}{${TM_SELECTED_TEXT}}");
		editor.insertSnippet(SnippetStr);
	});

	let givemered = vscode.commands.registerCommand('add-color-code.GiveMeRedCMD', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		
		vscode.window.showInformationMessage('Give you Red!');
		let SnippetStr = new vscode.SnippetString("\\textcolor{red}{${TM_SELECTED_TEXT}}");
		editor.insertSnippet(SnippetStr);
	});

	let deletecolors = vscode.commands.registerCommand('add-color-code.DeleteColorCMD', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		
		let selection = editor.selection;
		let text = editor.document.getText(selection);
		// vscode.window.showInformationMessage('选取的字数为：'+ text.length);

		var changed = false;
		var new_text = text;
		for (; ; ) { 
			let index = findindex(new_text.indexOf('\\textcolor{blue}'), new_text.indexOf('\\textcolor{red}'));
			if (index['loc'] != -1) {
				var left_cnt = 0;
				var right_cnt = 0;
				for (var j = index['loc'] + index['length']; j < new_text.length; j++) { 
					if (new_text[j] == '{'){left_cnt +=1;}
					if (new_text[j] == '}'){right_cnt +=1;}
					if (left_cnt == right_cnt){
						let endloc = j;
						new_text = new_text.substring(0,index['loc']) + new_text.substring(index['loc'] + index['length'] + 1, endloc) + new_text.substring(endloc + 1, new_text.length)
						changed = true;
						break;
					}
				}
				//vscode.window.showInformationMessage('{个数：'+ left_cnt + ', }个数：'+ right_cnt);
				if (j == new_text.length) { break;}
			}
			else{ break;}
		}
		//vscode.window.showInformationMessage(new_text);
		if (changed == true){
			//new_text = new_text.replace("$","\\$")
			let SnippetStr = new vscode.SnippetString();
			SnippetStr.appendText(new_text)
			editor.insertSnippet(SnippetStr);
		}
	});

	context.subscriptions.push(givemeblue);
	context.subscriptions.push(givemered);
	context.subscriptions.push(deletecolors);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
