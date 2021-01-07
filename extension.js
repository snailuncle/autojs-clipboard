// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const clipboardy = require("clipboardy");

// 引入Node.js 自带的 http 模块，并且把它赋值给 http 变量
const http = require("http");
const { URL } = require("url");
let Monitoring = false;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "autojs" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("autojs.helloautojs", function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("Hello autojs 牙叔!");
  });

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand("autojs.clipsync", function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user

    if (!Monitoring) {
      Monitoring = true;
      const server = http.createServer((req, res) => {
        const url = req.url;
        const myURL = new URL("http://127.0.0.1:7101" + url);
        // const myURL = new URL("https://example.org/?clipboard=123678");
        let value = myURL.searchParams.get("clipboard");
        if (value) {
          // base64反解析为字符串
          value = value.replace(/ /g, "+");
          value = Buffer.from(value, "base64").toString();
          setClipboardValue(value);
          res.end("ok");
        } else {
          res.end("clipboard value is empty");
        }
      });
      server.on("clientError", (err, socket) => {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
        vscode.window.showInformationMessage("请查看端口 7101 是否被占用");
      });
      server.listen(7101);
      vscode.window.showInformationMessage("牙叔提示: 剪贴板同步已开启");
    }

    function setClipboardValue(value) {
      let limit = 35;
      if (value) {
        if (value.length) {
          clipboardy.writeSync(value);
          if (value.length > limit) {
            value = value.slice(0, limit) + "...";
          }
          vscode.window.showInformationMessage("牙叔提示: " + value);
        }
      }
    }
  });

  context.subscriptions.push(disposable2);
}
// exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
