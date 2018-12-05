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
var Global_1 = __importDefault(require("./Global"));
var async_1 = __importDefault(require("async"));
var node_mcp23017_with_i2c_updated_1 = __importDefault(require("node-mcp23017_with_i2c_updated"));
var events_1 = __importDefault(require("events"));
//let folderLogs = "/free/CI24/Logs/Machine/";
//_log.init(folderLogs);
var Output = /** @class */ (function (_super) {
    __extends(Output, _super);
    function Output() {
        var _this = _super.call(this) || this;
        _this.mcp = new node_mcp23017_with_i2c_updated_1.default({
            address: 0x20,
            device: '/dev/i2c-1',
            debug: true
        });
        _this.mcp1 = new node_mcp23017_with_i2c_updated_1.default({
            address: 0x21,
            device: '/dev/i2c-1',
            debug: true
        });
        _this.column = '';
        _this.InitOut = function (cb) {
            try {
                async_1.default.parallel([
                    _this.InitOut1,
                    _this.InitOut2,
                ], function (err, result) {
                    ci_logmodule_1.default.write(err + result);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.InitOut1 = function (cb) {
            try {
                for (var i = 0; i < 16; i++) {
                    _this.mcp.pinMode(i, _this.mcp.OUTPUT);
                }
                cb(null, "inicialización A y B exitosa");
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.InitOut2 = function (cb) {
            try {
                for (var i = 0; i < 16; i++) {
                    _this.mcp1.pinMode(i, _this.mcp1.OUTPUT);
                }
                cb(null, "inicialización B, C y D exitosa");
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Select_Colunm = function (column) {
            try {
                ci_logmodule_1.default.write(column + typeof (column));
                async_1.default.mapSeries(Global_1.default.MCP_Columna, function (Columna, cb) {
                    if (Columna.ID.toString() == column) {
                        _this.column = Columna;
                        ci_logmodule_1.default.write('igual' + Columna);
                    }
                    ci_logmodule_1.default.write(_this.column + typeof (_this.column));
                    cb(null);
                }, function (err, data) {
                    _this.column.status = true;
                    _this.ChangeOutputStatus(_this.column);
                });
            }
            catch (e) {
                ci_logmodule_1.default.error(e.stack + 'error seleccionando columna');
            }
        };
        _this.Select_Colunm_low = function (column) {
            try {
                //  _log.write(column+typeof(column));
                async_1.default.mapSeries(Global_1.default.MCP_Columna, function (Columna, cb) {
                    if (Columna.ID.toString() == column) {
                        _this.column = Columna;
                        ci_logmodule_1.default.write('igual' + Columna);
                    }
                    ci_logmodule_1.default.write(_this.column + typeof (_this.column));
                    cb(null);
                }, function (err, data) {
                    _this.column.status = false;
                    _this.ChangeOutputStatus(_this.column);
                });
            }
            catch (e) {
                ci_logmodule_1.default.error(e.stack + 'error seleccionando columna');
            }
        };
        _this.HIGH = function (data, cb) {
            try {
                var pin = Array.from(data);
                if (pin.length > 2) {
                    cb("dato incorrecto");
                }
                else {
                    switch (pin[0]) {
                        case 'a':
                        case 'A':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.A.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.A);
                            cb(null, "pin activo");
                            break;
                        case 'b':
                        case 'B':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.B.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.B);
                            cb(null, "pin activo");
                            break;
                        case 'c':
                        case 'C':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.C.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.C);
                            cb(null, "pin activo");
                            break;
                        case 'd':
                        case 'D':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.D.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.D);
                            cb(null, "pin activo");
                            break;
                        case 'e':
                        case 'E':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.E.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.E);
                            cb(null, "pin activo");
                            break;
                        case 'f':
                        case 'F':
                            _this.Select_Colunm(pin[1]);
                            Global_1.default.MCP_row.F.status = true;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.F);
                            cb(null, "pin activo");
                            break;
                        default:
                            cb("dato incorrecto");
                    }
                }
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al activar pin" + e);
                cb("Error al activar pin");
            }
        };
        _this.LOW = function (data, cb) {
            try {
                var pin = Array.from(data);
                if (pin.length > 2) {
                    cb("dato incorrecto");
                }
                else {
                    switch (pin[0]) {
                        case 'a':
                        case 'A':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.A.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.A);
                            cb(null, "pin activo");
                            break;
                        case 'b':
                        case 'B':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.B.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.B);
                            cb(null, "pin desactivado");
                            break;
                        case 'c':
                        case 'C':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.C.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.C);
                            cb(null, "pin desactivado");
                            break;
                        case 'd':
                        case 'D':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.D.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.D);
                            cb(null, "pin desactivado");
                            break;
                        case 'e':
                        case 'E':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.E.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.E);
                            cb(null, "pin desactivado");
                            break;
                        case 'f':
                        case 'F':
                            _this.Select_Colunm_low(pin[1]);
                            Global_1.default.MCP_row.F.status = false;
                            _this.ChangeOutputStatus(Global_1.default.MCP_row.F);
                            cb(null, "pin desactivado");
                            break;
                        default:
                            cb("dato incorrecto");
                    }
                }
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al activar pin" + e);
                cb("Error al activar pin");
            }
        };
        _this.ChangeOutputStatus = function (data) {
            try {
                switch (data.MCP) {
                    case 1:
                        ci_logmodule_1.default.write("output: " + data.value + "   status:" + data.status + '  ' + data.text);
                        _this.mcp.digitalWrite(data.value, data.status);
                        break;
                    case 2:
                        ci_logmodule_1.default.write("output: " + data.value + "   status:" + data.status + '  ' + data.text);
                        _this.mcp1.digitalWrite(data.value, data.status);
                        break;
                }
            }
            catch (err) {
                ci_logmodule_1.default.error(err.toString.stack);
            }
        };
        _this.motorDown = function (cb) {
            try {
                Global_1.default.MCP_Motor.UP.status = false;
                Global_1.default.MCP_Motor.Down.status = true;
                Global_1.default.MCP_Motor.ENABLE.status = true;
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.Down);
                //   this.ChangeOutputStatus(global.MCP_Motor.ENABLE);
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.UP);
                cb(null, "ascensor bajando");
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al subir ascensor" + e.stack);
                cb("Error al subir ascensor");
            }
        };
        _this.motorUP = function (cb) {
            try {
                Global_1.default.MCP_Motor.UP.status = true;
                Global_1.default.MCP_Motor.Down.status = false;
                Global_1.default.MCP_Motor.ENABLE.status = true;
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.UP);
                //   this.ChangeOutputStatus(global.MCP_Motor.ENABLE);
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.Down);
                cb(null, "ascensor Subiendo  ");
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al bajar ascensor" + e.stack);
                cb("Error al bajar ascensor");
            }
        };
        _this.init_enable = function (cb) {
            try {
                Global_1.default.MCP_Motor.ENABLE.status = false;
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.ENABLE);
                cb(null, "inicializa enable");
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al enable" + e.stack);
                cb("Error al enabl");
            }
        };
        _this.motoroff = function (cb) {
            try {
                Global_1.default.MCP_Motor.UP.status = false;
                Global_1.default.MCP_Motor.Down.status = false;
                Global_1.default.MCP_Motor.ENABLE.status = false;
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.UP);
                _this.ChangeOutputStatus(Global_1.default.MCP_Motor.Down);
                // this.ChangeOutputStatus(global.MCP_Motor.ENABLE);
                cb(null, "ascensor apagado");
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al bajar ascensor" + e.stack);
                cb("Error al apagar ascensor");
            }
        };
        _this.stop_all_Pin = function (cb) {
            try {
                async_1.default.mapSeries(Global_1.default.motoresPiso, function (Pisos, cb1) {
                    async_1.default.mapSeries(Pisos, function (Motores, cb2) {
                        setTimeout(function () {
                            _this.LOW(Motores, function (err) {
                                ci_logmodule_1.default.write(Motores);
                                cb2(err, "bien");
                            });
                        }, 1000);
                    }, function (err, res) {
                        cb1(err, res);
                    });
                }, function (err, res) {
                    cb(err, res);
                });
            }
            catch (e) {
                ci_logmodule_1.default.error("Error al bajar ascensor" + e.stack);
                cb("Error al apagar ascensor");
            }
        };
        _this.stop_all = function (cb) {
            try {
                async_1.default.series([
                    _this.motoroff,
                    _this.stop_all_Pin
                ], function (err, result) {
                    Global_1.default.logger.debug('Result: motor y pines apagado  ');
                    cb(null, 'ok');
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.timepin = function (data, time, cb) {
            try {
                _this.HIGH(data, function (err) {
                    ci_logmodule_1.default.write("avanza" + err);
                });
                setTimeout(function () {
                    _this.LOW(data, function (err) {
                        ci_logmodule_1.default.write("detiene" + err);
                    });
                    cb(null, "funciona");
                }, time);
            }
            catch (e) {
                ci_logmodule_1.default.error("falla prueba de tiempo ");
                cb(null, "falla");
            }
        };
        return _this;
    }
    return Output;
}(events_1.default.EventEmitter));
exports.Output = Output;
