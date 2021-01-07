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
const history_1 = require("../tree/history");
const common_1 = require("./common");
class RemoveClipboardHistory {
    constructor(_manager) {
        this._manager = _manager;
        this._disposable = [];
        this._disposable.push(vscode.commands.registerCommand(common_1.commandList.removeClipboardHistory, this.execute, this));
    }
    execute(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value instanceof history_1.ClipHistoryItem) {
                value = value.clip.value;
            }
            // Update current clip in clipboard
            yield this._manager.removeClipboardValue(value);
        });
    }
    dispose() {
        this._disposable.forEach(d => d.dispose());
    }
}
exports.RemoveClipboardHistory = RemoveClipboardHistory;
//# sourceMappingURL=removeClipboardHistory.js.map