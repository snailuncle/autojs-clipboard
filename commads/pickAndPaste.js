"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../util");
const common_1 = require("./common");
class ClipPickItem {
    constructor(clip) {
        this.clip = clip;
        this.label = this.clip.value.replace(/\s+/g, " ").trim();
    }
    get description() {
        if (this.clip.createdAt) {
            const date = new Date(this.clip.createdAt);
            return date.toLocaleString();
        }
    }
}
class PickAndPasteCommand {
    constructor(_manager) {
        this._manager = _manager;
        this._disposable = [];
        this._disposable.push(vscode.commands.registerCommand(common_1.commandList.pickAndPaste, this.execute, this));
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = vscode.workspace.getConfiguration("clipboard-manager");
            const preview = config.get("preview", true);
            const clips = this._manager.clips;
            const maxLength = `${clips.length}`.length;
            const picks = clips.map((c, index) => {
                const item = new ClipPickItem(c);
                const indexNumber = util_1.leftPad(index + 1, maxLength, "0");
                item.label = `${indexNumber}) ${item.label}`;
                return item;
            });
            // Variable to check changes in document by preview
            let needUndo = false;
            const options = {
                placeHolder: "Select one clip to paste. ESC to cancel."
            };
            /**
             * If preview is enabled, get current text editor and replace
             * current selecion.
             * NOTE: not need paste if the text is replaced
             */
            if (preview) {
                options.onDidSelectItem = (selected) => __awaiter(this, void 0, void 0, function* () {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        editor.edit(edit => {
                            for (const selection of editor.selections) {
                                edit.replace(selection, selected.clip.value);
                            }
                            needUndo = true;
                        }, {
                            undoStopAfter: false,
                            undoStopBefore: false
                        });
                    }
                });
            }
            const pick = yield vscode.window.showQuickPick(picks, options);
            if (!pick) {
                if (needUndo) {
                    return yield vscode.commands.executeCommand("undo");
                }
                return;
            }
            // Update current clip in clipboard
            yield this._manager.setClipboardValue(pick.clip.value);
            // If text changed, only need remove selecion
            // If a error occur on replace, run paste command for fallback
            if (needUndo) {
                // Fix editor selection
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const selecions = editor.selections.map(s => new vscode.Selection(s.end, s.end));
                    editor.selections = selecions;
                }
                else {
                    return yield vscode.commands.executeCommand("cancelSelection");
                }
            }
            else {
                return yield vscode.commands.executeCommand("editor.action.clipboardPasteAction");
            }
        });
    }
    dispose() {
        this._disposable.forEach(d => d.dispose());
    }
}
exports.PickAndPasteCommand = PickAndPasteCommand;
//# sourceMappingURL=pickAndPaste.js.map