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
var events_1 = __importDefault(require("events"));
var async_1 = __importDefault(require("async"));
var Output_1 = require("./Output");
var out1 = new Output_1.Output();
//let folderLogs = "/free/CI24/Logs/Machine/";
//_log.init(folderLogs);
var Testfile = /** @class */ (function (_super) {
    __extends(Testfile, _super);
    function Testfile() {
        var _this = _super.call(this) || this;
        _this.Out1 = out1;
        _this.state = 0;
        _this.Testmotores = function (cb) {
            try {
                async_1.default.mapSeries(Global_1.default.motoresPiso, function (Pisos, cb1) {
                    async_1.default.mapSeries(Pisos, function (Motores, cb2) {
                        setTimeout(function () {
                            _this.Out1.timepin(Motores, 3000, function (err) {
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
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.TestmotoresPiso = function (Piso, cb) {
            try {
                async_1.default.mapSeries(Global_1.default.motoresPiso[Piso], function (Motores, cb1) {
                    setTimeout(function () {
                        _this.Out1.timepin(Motores, 3000, function (err, data) {
                            ci_logmodule_1.default.write(Motores + 'Time Pin');
                            cb1(err, data);
                        });
                    }, 1000);
                }, function (err) {
                    cb(err, "OK");
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        out1.InitOut(function (err) {
            ci_logmodule_1.default.write("Se inician salidas Mcp" + err);
        });
        return _this;
    }
    return Testfile;
}(events_1.default.EventEmitter));
exports.Testfile = Testfile;
