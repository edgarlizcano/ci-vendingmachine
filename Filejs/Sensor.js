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
var ProcessDataSensor_1 = require("./ProcessDataSensor");
var Mux_class_1 = require("./Mux_class");
var async_1 = __importDefault(require("async"));
//let folderLogs = "/free/CI24/Logs/Machine";
//_log.init(folderLogs);
var Sensor = /** @class */ (function (_super) {
    __extends(Sensor, _super);
    function Sensor() {
        var _this = _super.call(this) || this;
        _this.Sensorcomand = new ProcessDataSensor_1.ProcessDataSensor();
        _this.Mux = new Mux_class_1.Mux_class();
        _this.data = {
            port: '/dev/ttyAMA0',
            baudRate: 9600
        };
        _this.Check_Sensor = function (data, callback) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetSensor, null),
                    async_1.default.apply(_this.Sensorcomand.CheckPortOpen, data),
                ], function (err) {
                    callback(err);
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.Get_state = function (callback) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetSensor, null),
                    async_1.default.apply(_this.Sensorcomand.SendComand, null),
                ], function (err) {
                    callback(err);
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.Open_port = function (data, callback) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetSensor, null),
                    async_1.default.apply(_this.Sensorcomand.Open_port, data),
                ], function (err) {
                    callback(err);
                });
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        setTimeout(function () {
            _this.Check_Sensor(_this.data, function (err, dta) {
                ci_logmodule_1.default.write('err' + err);
                var intervalGoLevel = setInterval(function () {
                    _this.Get_state(function (err, dta) { });
                }, 2000);
            });
        }, 3000);
        return _this;
    }
    return Sensor;
}(events_1.default.EventEmitter));
exports.Sensor = Sensor;
