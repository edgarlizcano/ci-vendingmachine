"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//let _log = require('@ci24/ci-logmodule');
var ci_logmodule_1 = __importDefault(require("@ci24/ci-logmodule"));
var folderLogs = "/free/CI24/Logs/Machine/";
var data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "oto.log",
    "level": "INFO"
};
ci_logmodule_1.default.init(data);
ci_logmodule_1.default.debug("Ingrese la ubicacion que desea vender");
ci_logmodule_1.default.write("Ingrese la ubicacion que desea vender");
