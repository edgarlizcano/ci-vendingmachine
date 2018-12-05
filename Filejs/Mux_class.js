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
var Global_1 = __importDefault(require("./Global"));
var Output_1 = require("./Output");
var _Output = new Output_1.Output();
//let folderLogs = "/free/CI24/Logs/Machine/";
//_log.init(folderLogs);
var Mux_class = /** @class */ (function (_super) {
    __extends(Mux_class, _super);
    function Mux_class() {
        var _this = _super.call(this) || this;
        _this.readermux = {
            valueMux1: false,
            valueMux2: false
        };
        _this.sensormux = {
            valueMux1: true,
            valueMux2: false
        };
        _this._out = _Output;
        _this.SetReader = function (tx, cb) {
            ci_logmodule_1.default.write('Haciendo que la comunicacion de la lectora se active');
            Global_1.default.mux.Mux_1.status = _this.readermux.valueMux1;
            Global_1.default.mux.Mux_2.status = _this.readermux.valueMux2;
            _this._out.ChangeOutputStatus(Global_1.default.mux.Mux_1);
            _this._out.ChangeOutputStatus(Global_1.default.mux.Mux_2);
            /*   rpio.write(global.mux.Mux_1.value, this.readermux.valueMux1);
               rpio.write(global.mux.Mux_2.value, this.readermux.valueMux2);*/
            /*  rpio.write(global.mux.Mux_1.value, this.sensormux.valueMux1);
              rpio.write(global.mux.Mux_2.value, this.sensormux.valueMux2);*/
            cb(null, 'setReader');
        };
        _this.SetSensor = function (tx, cb) {
            ci_logmodule_1.default.write('Haciendo que la comunicacion del sensor se active');
            Global_1.default.mux.Mux_1.status = _this.sensormux.valueMux1;
            Global_1.default.mux.Mux_2.status = _this.sensormux.valueMux2;
            _this._out.ChangeOutputStatus(Global_1.default.mux.Mux_1);
            _this._out.ChangeOutputStatus(Global_1.default.mux.Mux_2);
            /*   rpio.write(global.mux.Mux_1.value, this.sensormux.valueMux1);
               rpio.write(global.mux.Mux_2.value, this.sensormux.valueMux2);*/
            cb(null, 'setReader');
        };
        return _this;
    }
    return Mux_class;
}(events_1.default.EventEmitter));
exports.Mux_class = Mux_class;
