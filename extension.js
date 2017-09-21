// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var _ = require('lodash');



function common(strings) {
    if (!Array.isArray(strings)) {
      throw new Error('common-prefix expects an array of strings')
    }
  
    var first = strings[0] || '';
    var commonLength = first.length
  
    for (var i = 1; i < strings.length; ++i) {
      for (var j = 0; j < commonLength; ++j) {
        if (strings[i].charAt(j) !== first.charAt(j)) {
          commonLength = j
          break
        }
      }
    }
  
    return first.slice(0, commonLength)
  }

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const settings = {};
    vscode.workspace.findFiles("prj_rel_link_config.json").then((files) => {
        if (_.head(files))
        _.merge(settings, require(_.head(files).path));
        console.log(settings);
    });
    console.log('Congratulations, your extension "projRelPath" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        //vscode.window.showInformationMessage(vscode.workspace.asRelativePath("/home/rhys/dndplanning/people/players/down",true));
        vscode.workspace.findFiles("**/*").then((files)=>{
        console.log(files);
        const filedict = files
            .reduce((obj, x) => Object.assign(obj, { [`${vscode.workspace.asRelativePath(x)}`]: x }), {});
        
       
        vscode.window.showQuickPick(Object.keys(filedict)).then((rval)=>{
           // vscode.TextEdit.insert(,rval);
           //rval = _.tail(rval.split("/")).join("/");
           if (rval){
           const custom_root = _.get(settings,"custom_root",false);
           if (custom_root){
               rval = rval.replace(common([custom_root, rval]), "");
           }

           vscode.window.activeTextEditor.edit((eb)=>{
               _.each(vscode.window.activeTextEditor.selections,(selection)=>{
               eb.insert(selection.end,`](${rval})`);
               eb.insert(selection.start,`[`);
               });         
           });
           }
        },(rval)=>{}); 
        
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;