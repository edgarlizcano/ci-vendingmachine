"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ci_logmodule_1 = __importDefault(require("@ci24/ci-logmodule"));
var events_1 = __importDefault(require("events"));
var _serial = require('@ci24/ci-serialmanager');
var Serial_Sensor_1 = require("./Serial_Sensor");
var async_1 = __importDefault(require("async"));
//let folderLogs = "/free/CI24/Logs/Machine";
//_log.init(folderLogs);
/*let folderLogs = "/free/CI24/Logs/Machine/";
let data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "test.log",
    "level": "INFO"
};

_log.init(data);*/
var ProcessDataSensor = /** @class */ (function (_super) {
    __extends(ProcessDataSensor, _super);
    function ProcessDataSensor() {
        var _this = _super.call(this) || this;
        _this.serialdata = new Serial_Sensor_1.Serial_Sensor();
        _this.buffer = new Buffer(0);
        _this.reference = null;
        _this.array = [];
        _this.array1 = [];
        _this.res = [];
        _this.long = 0;
        _this.state = 1;
        _this.ReadyData = false;
        _this.Trama_IN = [0xAA, 0x01, 0x01, 0x00, 0xBB];
        _this.Trama_POOL = [0xAA, 0x10, 0x01, 0x11, 0xBB];
        _this.Trama_STATE = [0xAA, 0x32, 0x01, 0x33, 0xBB];
        _this.baudRate = 0;
        _this.port = 0;
        _this.CheckPortOpen = function (data, cb) {
            try {
                ci_logmodule_1.default.write("port:{0}:baudRate:{1}" + data.port, data.baudRate);
                if (data.port.length > 0) {
                    _this.port = data.port;
                }
                if (data.baudRate > 0) {
                    _this.baudRate = data.baudRate;
                }
                _this.check_open_port(null, function (check, cmdOk) {
                    ci_logmodule_1.default.write("check:{0}:cmdOk:{1}" + check, cmdOk);
                    if (!check) {
                        if (cmdOk == false) {
                            ci_logmodule_1.default.write("send cmd...");
                            var trama = [0xAA, 0x10, 0x01, 0x11, 0xBB];
                            //let trama =[0xAA, 0x01, 0x01, 0x00, 0xBB];
                            _serial.EnviarComando(trama);
                            cb(null, { port: _this.port });
                        }
                        else {
                            cb(null, { port: _this.port });
                        }
                    }
                    else {
                        cb('error del puerto');
                    }
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception);
                cb(exception);
            }
        };
        _this.check_open_port = function (data, callback) {
            try {
                if (_serial.isOpen()) {
                    callback(null, false);
                    ;
                }
                else {
                    ci_logmodule_1.default.write("port close...");
                    var trama = [0xAA, 0x10, 0x01, 0x11, 0xBB];
                    var portRestricted = new Array();
                    ci_logmodule_1.default.write("trama 1:{0}" + JSON.stringify(trama));
                    _serial.buscarPuerto(trama, _this.baudRate, _this.port, portRestricted, function (check, data, port) {
                        ci_logmodule_1.default.write("check:{0}" + check);
                        if (check == true) {
                            ci_logmodule_1.default.write("port:{0}" + port);
                            _this.port = port;
                            callback(null, true);
                        }
                        else {
                            _this.port = port;
                            callback('error abriendopuerto');
                        }
                    });
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception);
                callback(exception);
            }
        };
        _this.Open_port = function (data, callback) {
            try {
                if (_serial.isOpen()) {
                    callback(null, { executeCmd: false });
                }
                else {
                    ci_logmodule_1.default.write("port close...");
                    _serial.AbrirPuerto(data.port, data.baudRate, function (check, port) {
                        ci_logmodule_1.default.write("check:{0}" + check);
                        if (check == true) {
                            ci_logmodule_1.default.write("port:{0}" + port);
                            callback(null, { executeCmd: true });
                        }
                        else {
                            callback('no se pudo abrrir puerto');
                        }
                    });
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception);
                callback(exception);
            }
        };
        _this.EventSerialData = function (data) {
            try {
                _this.buffer = Buffer.concat([_this.buffer, data]);
                if (_this.reference != null) {
                    clearTimeout(_this.reference);
                }
                for (var i = 0; i < _this.buffer.length; i++) {
                    _this.array.push(_this.buffer[i]);
                }
                _this.reference = setTimeout(function () {
                    _this.buffer = new Buffer(0);
                    //  this.array1=this.array.slice(this.array.indexOf(0xcc), this.array.indexOf(0xbb));
                    //_log.write("Dato Recibido------>>    " + JSON.stringify(this.array));
                    _this.Validate(function (err, data) {
                        if (err == null) {
                            _this.ReadyData = true;
                            _this.state = 1;
                            _this.BufferIn = _this.array;
                            _this.array1 = _this.array;
                            _this.array = [];
                        }
                        else {
                            _this.ReadyData = true;
                            _this.state = 0;
                            _this.BufferIn = data;
                            _this.array1 = _this.array;
                            _this.array = [];
                        }
                    });
                }, 250);
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
            }
        };
        _this.Validate = function (callback) {
            try {
                //  this.array = [];
                //  this.array = data;
                _this.CRC = _this.CRC_Vending_Machine(_this.array);
                if (_this.CRC == _this.array[_this.array.length - 2]) {
                    //_log.write('Crc correcto');
                    callback(null, 'CRC correcto');
                }
                else {
                    ci_logmodule_1.default.error('Crc incorrecto');
                    callback('CRC incorrecto', _this.array);
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.CRC_Vending_Machine = function (data) {
            try {
                var crc = 0;
                // _log.write(JSON.stringify(data));
                _this.long = (data.length - 2);
                for (var i = 1; i < _this.long; i++) {
                    crc ^= data[i];
                }
                return crc;
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
            }
        };
        _this.SendComand = function (txt, cb) {
            try {
                async_1.default.series([
                    /*         _async.apply(this.check_open_port,null),
                           _async.apply(this.SendComand_,this.Trama_IN),
                             _async.apply(this.POOLSTATE,null),
                           _async.apply(this.SendComand_,this.Trama_POOL),
                            _async.apply(this.POOLSTATE,null),*/
                    async_1.default.apply(_this.SendComand_, _this.Trama_STATE),
                    async_1.default.apply(_this.POOLSTATE, null),
                ], function (err) {
                    cb(err);
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
            }
        };
        _this.SendComand_check = function (txt, cb) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.check_open_port, null),
                    async_1.default.apply(_this.SendComand_, _this.Trama_POOL),
                    async_1.default.apply(_this.POOLSTATE, null),
                ], function (err) {
                    cb(err);
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
            }
        };
        _this.SendComand_ = function (trama, cb) {
            try {
                _this.ReadyData = false;
                setTimeout(function () {
                    _serial.EnviarComando(trama);
                }, 500);
                cb(null);
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
            }
        };
        _this.POOLSTATE = function (data, callback) {
            try {
                var Interval_1 = null;
                Interval_1 = setInterval(function () {
                    if (Interval_1 != null) {
                        Interval_1 = null;
                        clearInterval(Interval_1);
                        ci_logmodule_1.default.write("POLL HABILITADO");
                        _this.waitForReadyData(3000, function (err, data) {
                            if (data.Check === true) {
                                _this.serialdata.POLLSTATEDATA(_this.array1, data.state, function (err, data) {
                                    if (err == null) {
                                        callback(null, data);
                                        _this.array1 = [];
                                    }
                                    else {
                                        callback(err);
                                        _this.array1 = [];
                                    }
                                });
                            }
                            else {
                                ci_logmodule_1.default.write("Se Agoto el tiempo de espera");
                                clearInterval(Interval_1);
                                Interval_1 = null;
                                callback("Error Device No Connected");
                            }
                        });
                    }
                }, 500);
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _serial.Event().on('serialData', _this.EventSerialData);
        return _this;
    }
    ProcessDataSensor.prototype.waitForReadyData = function (timeout, cb) {
        var _this = this;
        try {
            this.BufferIn = new Array(0);
            var count_1 = 0;
            var interval_1 = setInterval(function () {
                if (_this.ReadyData) {
                    count_1 = 0;
                    clearInterval(interval_1);
                    var resp = {
                        Check: true,
                        state: _this.state
                    };
                    cb(null, resp);
                }
                else {
                    count_1 += 100;
                    if (count_1 >= timeout) {
                        count_1 = 0;
                        clearInterval(interval_1);
                        var resp = {
                            Check: false
                        };
                        cb(null, resp);
                    }
                }
            }, 100);
        }
        catch (exception) {
            ci_logmodule_1.default.error("Exception: {0}" + exception.stack);
        }
    };
    ;
    return ProcessDataSensor;
}(events_1.default.EventEmitter));
exports.ProcessDataSensor = ProcessDataSensor;
