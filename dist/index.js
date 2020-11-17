"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const os = __importStar(require("os"));
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const toolCache = __importStar(require("@actions/tool-cache"));
const core = __importStar(require("@actions/core"));
function downloadUrl(version) {
    switch (os.type()) {
        case 'Linux':
            return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_linux_amd64', version);
        case 'Darwin':
            return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_darwin_amd64', version);
        case 'Windows_NT':
        default:
            return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_windows_amd64.exe', version);
    }
}
const binaryName = 'aws-iam-authenticator';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = core.getInput('version', { 'required': true });
        let cachedToolpath = toolCache.find(binaryName, version);
        if (!cachedToolpath) {
            const downloadPath = yield toolCache.downloadTool(downloadUrl(version));
            fs.chmodSync(downloadPath, '0755');
            cachedToolpath = yield toolCache.cacheFile(downloadPath, binaryName, binaryName, version);
        }
        core.addPath(cachedToolpath);
    });
}
run().catch(core.setFailed);
