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
var Testfile_1 = require("./Testfile");
var Shop_1 = require("./Shop");
var Output_1 = require("./Output");
var Global_1 = __importDefault(require("./Global"));
var out1 = new Output_1.Output();
var Reader_1 = require("./Reader");
var Sensor_1 = require("./Sensor");
var ci_syslogs_1 = require("ci-syslogs");
var Log = new ci_syslogs_1.Logger("0.0.0.0", ci_syslogs_1.Logger.Facilities.Machine);
var folderLogs = "/free/CI24/Logs/Machine/";
var data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "oto245.log",
    "level": "INFO"
};
ci_logmodule_1.default.init(data);
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.Test = new Testfile_1.Testfile();
        _this._Sensor = new Sensor_1.Sensor();
        _this.Compra = new Shop_1.Shop(_this);
        _this._Reader = new Reader_1.Reader();
        _this.Out_ = out1;
        _this.Is_init_location = false;
        _this.Is_empty = true;
        _this.Up_elevator = function (cb) {
            try {
                _this.Out_.motorUP(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Down_elevator = function (cb) {
            try {
                _this.Out_.motorDown(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.off_elevator = function (cb) {
            try {
                _this.Out_.motoroff(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Testmotores = function (cb) {
            try {
                _this.Test.Testmotores(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.TestmotoresPiso = function (Piso, cb) {
            try {
                _this.Test.TestmotoresPiso(Piso, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.GotoLevel = function (data, cb) {
            try {
                ci_logmodule_1.default.write('main Gotolevel');
                _this.Compra.GotoLevel(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Sale = function (data, cb) {
            try {
                _this.Compra.Sale(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Sale_big = function (data, cb) {
            try {
                _this.Compra.Sale_big(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Close = function (cb) {
            try {
                _this.Compra.Close(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Open = function (cb) {
            try {
                _this.Compra.Open_(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Time_pin = function (data, cb) {
            try {
                _this.Out_.timepin(data, 10000, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Open_Port = function (data, cb) {
            try {
                _this._Reader.Open_Port(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.CheckReader = function (data, cb) {
            try {
                _this._Reader.CheckReader(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.GetIdCard = function (cb) {
            try {
                _this._Reader.GetIdCard(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Check_Sensor = function (data, cb) {
            try {
                _this._Sensor.Check_Sensor(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Open_port = function (data, cb) {
            try {
                _this._Sensor.Open_port(data, function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Get_state = function (cb) {
            try {
                _this._Sensor.Get_state(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Is_dispensing = function (data) {
            try {
                var result = {
                    cmd: 'Ok_dispensing',
                    data: data
                };
                _this.emit('Event', result);
                Log.LogDebug('emitiendo evento de recoger producto');
                //_log.debug('emitiendo evento de recoger producto')
            }
            catch (e) {
                Log.LogError(e.stack + "Error al obtener el estado del sensor");
                //_log.error(e.stack+"Error al obtener el estado del sensor");
            }
        };
        _this.Is_busy = function (data) {
            try {
                var result = {
                    cmd: 'Busy',
                    data: data
                };
                _this.emit('Event', result);
                Log.LogDebug('emitiendo evento de estado de bandeja inferior');
                //_log.debug('emitiendo evento de estado de bandeja inferior')
            }
            catch (e) {
                Log.LogError(e.stack + "Error al obtener el estado de bandeja inferior");
                //_log.error(e.stack+"Error al obtener el estado de bandeja inferior");
            }
        };
        _this.Atasco = function () {
            try {
                var result = {
                    cmd: '-',
                    data: ''
                };
                _this.emit('Event', result);
                Log.LogDebug('emitiendo evento de estado de bandeja inferior');
                //_log.debug('emitiendo evento de estado de bandeja inferior')
            }
            catch (e) {
                Log.LogError(e.stack + "Error al obtener el estado de bandeja inferior");
                //_log.error(e.stack+"Error al obtener el estado de bandeja inferior");
            }
        };
        _this.clean_pin = function (cb) {
            try {
                _this.Out_.stop_all(function (err, data) {
                    cb(err, data);
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Log.LogError(JSON.stringify(Global_1.default.result.EXCEPTION));
                //_log.error(JSON.stringify(global.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.state_Machine = Global_1.default.State_Machine.No_task;
        return _this;
    }
    return Main;
}(events_1.default.EventEmitter));
exports.Main = Main;
