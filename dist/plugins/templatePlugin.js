"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePlugin = void 0;
const plugin_1 = __importDefault(require("../plugin"));
class TemplatePlugin extends plugin_1.default {
    constructor() {
        super(...arguments);
        this.player = {};
    }
    initialize(player) {
        this.player = player;
        // Initialize the plugin with the player
    }
    use() {
        //
    }
    dispose() {
        //
    }
}
exports.TemplatePlugin = TemplatePlugin;
