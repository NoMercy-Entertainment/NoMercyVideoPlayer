"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor() {
        this.player = {};
    }
    initialize(player) {
        this.player = player;
        // Setup any necessary initial state or configuration here
    }
    use() {
        // Your plugin logic goes here
    }
    dispose() {
        // Clean up any resources or listeners here
    }
}
exports.default = Plugin;
