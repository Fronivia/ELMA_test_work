"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugins = void 0;
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const path_1 = __importDefault(require("path"));
function getPlugins() {
    return [
        new html_webpack_plugin_1.default({
            template: path_1.default.resolve(__dirname, '../../public/index.html'),
            filename: 'index.html',
        }),
        new eslint_webpack_plugin_1.default({
            extensions: ['.js', '.ts'],
            exclude: 'node_modules',
        }),
    ];
}
exports.getPlugins = getPlugins;
//# sourceMappingURL=plugins.js.map