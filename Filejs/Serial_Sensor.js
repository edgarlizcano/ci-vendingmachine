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
var ConfigMachine_1 = __importDefault(require("./ConfigMachine"));
var Serial_Sensor = /** @class */ (function (_super) {
    __extends(Serial_Sensor, _super);
    function Serial_Sensor() {
        var _this = _super.call(this) || this;
        _this.POLLSTATEDATA = function (BufferIn, state, callback) {
            try {
                if (state == 1) {
                    //  _log.write('se recibe trama para revisar'+JSON.stringify(BufferIn));
                    switch (BufferIn[2]) {
                        case 0x01:
                        case '01':
                            _this.Resp_Check(BufferIn, function (err, data) {
                                callback(err, data);
                            });
                            break;
                        case 0x02:
                        case '02':
                            _this.command_2(BufferIn, function (err, data) {
                                callback(err, data);
                            });
                            break;
                        case 0x04:
                        case '04':
                            _this.Process_state(BufferIn, function (err, data) {
                                callback(err, data);
                            });
                            break;
                        default:
                            ci_logmodule_1.default.write('Trama no identificada ----->' + JSON.stringify(BufferIn));
                            callback(null, 'Trama no identificada');
                            break;
                    }
                }
                else {
                    ci_logmodule_1.default.error('CRC incorrecta,   Longitud de trama=  ' + BufferIn.length + '    Respuesta incorrecta');
                    //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                    callback('trama incorrecta');
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.Resp_Check = function (BufferIn, callback) {
            try {
                if (BufferIn[0] == 0xcc && BufferIn[BufferIn.length - 1] == 0xbb) {
                    ci_logmodule_1.default.write('Inicio y fin de trama correcto de check Sensores' + 'CRC correcto,   Longitud de trama=  ' + BufferIn.length);
                    if (BufferIn[1] == 0x10) {
                        //_log.write('Trama respuesta check ----->'+JSON.stringify(BufferIn));
                        callback(null, 'ok');
                    }
                    else {
                        //_log.error('respuesta de check desconocida----->'+JSON.stringify(BufferIn));
                        callback(null, 'ok');
                    }
                }
                else {
                    ci_logmodule_1.default.error('Respuesta incorrett,   Longitud de trama=  ' + BufferIn.length + '    aparecte respuesta de check');
                    //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                    callback('Respuesta incorrett');
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.command_2 = function (BufferIn, callback) {
            try {
                if (BufferIn[0] == 0xcc && BufferIn[BufferIn.length - 1] == 0xbb) {
                    ci_logmodule_1.default.write('Inicio y fin de trama correcto de comand 2 Sensores' + 'CRC correcto,   Longitud de trama=  ' + BufferIn.length);
                    if (BufferIn[1] == 0x8a) {
                        ci_logmodule_1.default.write('Trama respuesta command 2----->' + JSON.stringify(BufferIn));
                        callback(null, 'ok');
                    }
                    else if (BufferIn[1] == 0x9b) {
                        ci_logmodule_1.default.error('Trama respuesta command 2 ----->' + JSON.stringify(BufferIn));
                        callback('al parecer no se ha habilitado la comunicacion con el comando pool');
                    }
                    else {
                        ci_logmodule_1.default.error('respuesta de command 2 desconocida----->' + JSON.stringify(BufferIn));
                        callback(null, 'ok');
                    }
                }
                else {
                    ci_logmodule_1.default.error('Respuesta incorrett,   Longitud de trama=  ' + BufferIn.length + '    aparecte respuesta de check');
                    //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                    callback('Respuesta incorrett');
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        _this.Process_state = function (BufferIn, callback) {
            try {
                if (BufferIn[0] == 0xcc && BufferIn[BufferIn.length - 1] == 0xbb) {
                    ci_logmodule_1.default.write('Inicio y fin de trama correcto de estado de sensores' + 'CRC correcto, Longitud de trama=' + BufferIn.length);
                    if (BufferIn[3] == 0x33) {
                        if (BufferIn[4] > 0xf0) {
                            ci_logmodule_1.default.warning('esta desocupada----->' + JSON.stringify(BufferIn));
                            ConfigMachine_1.default.Is_empty = true;
                            callback(null, '');
                        }
                        else {
                            ci_logmodule_1.default.fatal('esta ocupada----->' + JSON.stringify(BufferIn));
                            callback(null, 'ok');
                            ConfigMachine_1.default.Is_empty = false;
                        }
                    }
                    else {
                        ci_logmodule_1.default.error('respuesta de state desconocida----->' + JSON.stringify(BufferIn));
                        callback('respuesta de state');
                    }
                }
                else {
                    ci_logmodule_1.default.error('Respuesta incorrett,   Longitud de trama=  ' + BufferIn.length + '    aparecte respuesta de check');
                    //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                    callback('Respuesta incorrett,');
                }
            }
            catch (exception) {
                ci_logmodule_1.default.error("Exception" + exception.stack);
                callback(exception);
            }
        };
        return _this;
    }
    return Serial_Sensor;
}(events_1.default.EventEmitter));
exports.Serial_Sensor = Serial_Sensor;
