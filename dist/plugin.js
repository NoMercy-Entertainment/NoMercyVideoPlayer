"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    constructor() {
        this.player = {};
    }
    initialize(player) {
        this.player = player;
        // This method should be overridden by subclasses
    }
    use() {
        // This method should be overridden by subclasses
    }
}
exports.default = Plugin;
