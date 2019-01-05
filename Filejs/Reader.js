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
var async_1 = __importDefault(require("async"));
var _reader = require('@ci24/ci-readersl025');
var Mux_class_1 = require("./Mux_class");
var Reader = /** @class */ (function (_super) {
    __extends(Reader, _super);
    function Reader() {
        var _this = _super.call(this) || this;
        _this.Reader = new _reader();
        _this.Mux = new Mux_class_1.Mux_class();
        _this.Open_Port = function (data, cb) {
            try {
                _this.Reader.Open_Port(data, function (res) {
                    if (res === null) {
                        cb(null);
                    }
                    else {
                        ci_logmodule_1.default.write("error abriendo puerto ");
                    }
                });
            }
            catch (err) {
                ci_logmodule_1.default.error("Exception:{0}" + err.toString());
                cb(err);
            }
        };
        ///*****************************************************************************
        /////////////////////////////////////CheckReader///////////////////////////////
        //*****************************************************************************
        _this.CheckReader = function (data, cb) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetReader, null),
                    async_1.default.apply(_this.Reader.CheckDevice, data)
                ], function (err, result) {
                    if (err === null) {
                        cb(null, result);
                    }
                    else {
                        cb(err);
                    }
                });
            }
            catch (err) {
                ci_logmodule_1.default.error("Exception:{0}" + err.toString() + err.stack);
                cb(err);
            }
        };
        //*****************************************************************************
        /////////////////////////////////////WriteCard///////////////////////////////
        //*****************************************************************************
        _this.WriteCard = function (data, cb) {
            try {
                ci_logmodule_1.default.write('numReader:' + data.numReader + 'sector:' + data.sector + 'block:' + data.numBlocks);
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetReader, null),
                    async_1.default.apply(_this.Reader.WriteCard, data)
                ], function (err, result) {
                    if (err === null) {
                        cb(null, result[1]);
                    }
                    else {
                        cb(err);
                    }
                });
            }
            catch (err) {
                ci_logmodule_1.default.write("Exception:{0}" + err.toString(), ci_logmodule_1.default.level.ERROR);
                cb(err);
            }
        };
        //*****************************************************************************
        /////////////////////////////////////ReadCard///////////////////////////////
        //*****************************************************************************
        _this.ReadCard = function (data, cb) {
            try {
                ci_logmodule_1.default.write('numReader:' + data.numReader + 'sector:' + data.sector + 'block:' + data.numBlocks);
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetReader, null),
                    async_1.default.apply(_this.Reader.ReadCard, data)
                ], function (err, result) {
                    if (err === null) {
                        cb(null, result[1]);
                    }
                    else {
                        cb(err);
                    }
                });
            }
            catch (err) {
                ci_logmodule_1.default.write("Exception:{0}" + err.toString(), ci_logmodule_1.default.level.ERROR);
                cb(err);
            }
        };
        ////*****************************************************************************
        /////////////////////////GetIdCard1////////////////////////////////////7
        //*****************************************************************************
        _this.GetIdCard = function (cb) {
            try {
                async_1.default.series([
                    async_1.default.apply(_this.Mux.SetReader, null),
                    async_1.default.apply(_this.Reader.GetIdCard, null)
                ], function (err, result) {
                    if (err === null) {
                        ci_logmodule_1.default.write('Resultado de funcion IdCard:{0}' + (JSON.stringify(result)));
                        cb(null, result[1]);
                    }
                    else {
                        cb(err);
                    }
                });
            }
            catch (err) {
                ci_logmodule_1.default.write("Exception:{0}" + err.toString(), ci_logmodule_1.default.level.ERROR);
                cb(err);
            }
        };
        return _this;
    }
    return Reader;
}(events_1.default.EventEmitter));
exports.Reader = Reader;
