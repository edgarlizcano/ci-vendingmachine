//let _log = require('@ci24/ci-logmodule');
import _log from '@ci24/ci-logmodule';
let folderLogs = "/free/CI24/Logs/Machine/";
let data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "oto.log",
    "level": "INFO"
};

_log.init(data);
_log.debug("Ingrese la ubicacion que desea vender");
_log.write("Ingrese la ubicacion que desea vender");