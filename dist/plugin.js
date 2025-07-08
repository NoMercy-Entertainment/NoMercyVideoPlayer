"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor() {
        this.player = {};
    }
    initialize(player) {
        this.player = player;
    }
    use() {
    }
    dispose() {
    }
}
exports.default = Plugin;
