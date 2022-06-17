"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const root = (absolutePath) => path.resolve(__dirname, `../${absolutePath}`);
exports.default = {
    mode: 'development',
    context: path.resolve(__dirname, '../src'),
    entry: './index.ts',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: root('build'),
        clean: true,
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        compress: true,
        historyApiFallback: true,
        static: {
            directory: root('/build'),
        },
    },
    module: (0, utils_1.getModule)(),
    plugins: (0, utils_1.getPlugins)(),
    resolve: {
        alias: {
            '@': root('src/'),
        },
        extensions: ['.ts', '.js', '.json'],
    },
};
//# sourceMappingURL=config.dev.js.map