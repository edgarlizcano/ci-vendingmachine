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
var rpi_gpio_1 = __importDefault(require("rpi-gpio"));
/*import _async from "async";
import {Output} from './Output';*/
//let folderLogs = "/free/CI24/Logs/Machine";
//_log.init(folderLogs);
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input(_principal) {
        var _this = _super.call(this) || this;
        _this.Is_pin_ok = [];
        _this.P1 = false;
        _this.P2 = false;
        _this.P3 = false;
        _this.P4 = false;
        _this.P5 = false;
        _this.P6 = false;
        _this.SM = false;
        _this.Open = function () {
            try {
                //----------Sensores-------------------//
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S3.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S4.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S5.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S6.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.SM.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.initial_elevator);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP1);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP2);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P3.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP3);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P4.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP4);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P5.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP5);
                rpi_gpio_1.default.setup(Global_1.default.Pulso.P6.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH, _this.readInput_InP6);
                rpi_gpio_1.default.setup(Global_1.default.Aux.A1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Aux.A2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Card.Int.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Card.Out.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.elevator.Up.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.elevator.Down.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.general.stop.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
            }
            catch (e) {
                ci_logmodule_1.default.error(e.stack + JSON.stringify(Global_1.default.result.ERROR_INIT_GPIO));
            }
        };
        _this.Close = function (cb) {
            try {
                rpi_gpio_1.default.destroy(function (err) {
                    ci_logmodule_1.default.write('Desabilitados tods los sensores' + err);
                    cb(err);
                });
            }
            catch (e) {
                ci_logmodule_1.default.error(e.stack + "Error detener sensores  ");
                cb(e);
            }
        };
        _this.initial_elevator = function () {
            rpi_gpio_1.default.read(Global_1.default.Sensor.SM.PIN, function (err, value) {
                if (err == null) {
                    if (value == true) {
                        // this.emit("Sensor On","SM");
                        ci_logmodule_1.default.write("Sensor On " + "SM");
                        _this.Principal.Is_init_location = true;
                        _this.SM = true;
                    }
                    else {
                        //  this.emit("Sensor off","SM");
                        _this.Principal.Is_init_location = false;
                        ci_logmodule_1.default.write("Sensor Off " + "SM");
                        _this.SM = false;
                    }
                }
                else {
                    ci_logmodule_1.default.error('no se pudo iniziaclizar el estado de elevador ');
                }
            });
        };
        _this.initial_elevator_call = function (data, cb) {
            rpi_gpio_1.default.read(Global_1.default.Sensor.SM.PIN, function (err, value) {
                if (err == null) {
                    if (value == true) {
                        // this.emit("Sensor On","SM");
                        ci_logmodule_1.default.write("Sensor On " + "SM");
                        _this.Principal.Is_init_location = true;
                        _this.SM = true;
                        cb(null);
                    }
                    else {
                        //  this.emit("Sensor off","SM");
                        _this.Principal.Is_init_location = false;
                        ci_logmodule_1.default.write("Sensor Off " + "SM");
                        _this.SM = false;
                        cb(null);
                    }
                }
                else {
                    ci_logmodule_1.default.error(JSON.stringify(Global_1.default.result.ERROR_READ_PIN_SM));
                    cb('Error: ' + Global_1.default.result.ERROR_READ_PIN_SM.value);
                }
            });
        };
        _this.readInput_InP1 = function () {
            _this.initial_pin(Global_1.default.Pulso.P1, Global_1.default.motoresPiso.A);
        };
        _this.readInput_InP2 = function () {
            _this.initial_pin(Global_1.default.Pulso.P2, Global_1.default.motoresPiso.B);
        };
        _this.readInput_InP3 = function () {
            _this.initial_pin(Global_1.default.Pulso.P3, Global_1.default.motoresPiso.C);
        };
        _this.readInput_InP4 = function () {
            _this.initial_pin(Global_1.default.Pulso.P4, Global_1.default.motoresPiso.D);
        };
        _this.readInput_InP5 = function () {
            _this.initial_pin(Global_1.default.Pulso.P5, Global_1.default.motoresPiso.E);
        };
        _this.readInput_InP6 = function () {
            _this.initial_pin(Global_1.default.Pulso.P6, Global_1.default.motoresPiso.F);
        };
        _this.initial_pin = function (pin, array) {
            rpi_gpio_1.default.read(pin.PIN, function (err, value) {
                if (err == null) {
                    if (value == true) {
                        ci_logmodule_1.default.warning("Sensor  " + pin.text + "   Mal ubicado se empieza a reubicar");
                        _this.Is_pin_ok.push(array);
                    }
                    else {
                        ci_logmodule_1.default.write("Sensor  " + pin.text + "   En pocision correcta");
                    }
                }
                else {
                    ci_logmodule_1.default.error('no se pudo iniziaclizar el estado de elevador ');
                }
            });
        };
        _this.pollcbsensor = function (pin, state) {
            _this.Emit(state, pin);
        };
        _this.Emit = function (state, pin) {
            if (state === true) {
                switch (pin) {
                    case Global_1.default.Sensor.S1.PIN:
                        _this.emit("Sensor On", "S1");
                        ci_logmodule_1.default.write("Sensor On " + "S1");
                        break;
                    case Global_1.default.Sensor.S2.PIN:
                        _this.emit("Sensor On", "S2");
                        ci_logmodule_1.default.write("Sensor On " + "S2");
                        break;
                    case Global_1.default.Sensor.S3.PIN:
                        _this.emit("Sensor On", "S3");
                        ci_logmodule_1.default.write("Sensor On " + "S3");
                        break;
                    case Global_1.default.Sensor.S4.PIN:
                        _this.emit("Sensor On", "S4");
                        ci_logmodule_1.default.write("Sensor On " + "S4");
                        break;
                    case Global_1.default.Sensor.S5.PIN:
                        _this.emit("Sensor On", "S5");
                        ci_logmodule_1.default.write("Sensor On " + "S5");
                        break;
                    case Global_1.default.Sensor.S6.PIN:
                        _this.emit("Sensor On", "S6");
                        ci_logmodule_1.default.write("Sensor On " + "S6");
                        break;
                    case Global_1.default.Sensor.SM.PIN:
                        if (_this.SM == false) {
                            _this.emit("Sensor On", "SM");
                            ci_logmodule_1.default.write("Sensor On " + "SM");
                            _this.SM = true;
                        }
                        break;
                    case Global_1.default.Pulso.P1.PIN:
                        if (_this.P1 == false) {
                            _this.emit("Input On", "P1");
                            ci_logmodule_1.default.write(" On " + "P1");
                            _this.P1 = true;
                        }
                        break;
                    case Global_1.default.Pulso.P2.PIN:
                        if (_this.P2 == false) {
                            _this.emit("Input On", "P2");
                            ci_logmodule_1.default.write(" On " + "P2");
                            _this.P1 = true;
                        }
                        break;
                    case Global_1.default.Pulso.P3.PIN:
                        if (_this.P3 == false) {
                            _this.emit("Input On", "P3");
                            ci_logmodule_1.default.write(" On " + "P3");
                            _this.P3 = true;
                        }
                        break;
                    case Global_1.default.Pulso.P4.PIN:
                        if (_this.P4 == false) {
                            _this.emit("Input On", "P4");
                            ci_logmodule_1.default.write(" On " + "P4");
                            _this.P4 = true;
                        }
                        break;
                    case Global_1.default.Pulso.P5.PIN:
                        if (_this.P5 == false) {
                            _this.emit("Input On", "P5");
                            ci_logmodule_1.default.write(" On " + "P5");
                            _this.P5 = true;
                        }
                        break;
                    case Global_1.default.Pulso.P6.PIN:
                        if (_this.P6 == false) {
                            _this.emit("Input On", "P6");
                            ci_logmodule_1.default.write(" On " + "P6");
                            _this.P6 = true;
                        }
                        break;
                    case Global_1.default.Aux.A1.PIN:
                        _this.emit("Aux On", "A1");
                        break;
                    case Global_1.default.Aux.A2.PIN:
                        _this.emit("Aux On", "A2");
                        break;
                    case Global_1.default.Card.Int.PIN:
                        _this.emit("Card On", "Int");
                        break;
                    case Global_1.default.Card.Out.PIN:
                        _this.emit("Card On", "Out");
                        break;
                    case Global_1.default.elevator.Up.PIN:
                        _this.emit("elevator Off", "Up");
                        ci_logmodule_1.default.write(" On " + "Up");
                        break;
                    case Global_1.default.elevator.Down.PIN:
                        _this.emit("elevator Off", "Down");
                        ci_logmodule_1.default.write(" On " + "down");
                        break;
                    case Global_1.default.general.stop.PIN:
                        _this.emit("Stop", "on");
                        ci_logmodule_1.default.write(" On " + "Stop");
                        break;
                }
            }
            else {
                switch (pin) {
                    case Global_1.default.Sensor.S1.PIN:
                        _this.emit("Sensor off", "S1");
                        ci_logmodule_1.default.write("Sensor Off " + "S1");
                        break;
                    case Global_1.default.Sensor.S2.PIN:
                        _this.emit("Sensor off", "S2");
                        ci_logmodule_1.default.write("Sensor Off " + "S2");
                        break;
                    case Global_1.default.Sensor.S3.PIN:
                        _this.emit("Sensor off", "S3");
                        ci_logmodule_1.default.write("Sensor Off " + "S3");
                        break;
                    case Global_1.default.Sensor.S4.PIN:
                        _this.emit("Sensor off", "S4");
                        ci_logmodule_1.default.write("Sensor Off " + "S4");
                        break;
                    case Global_1.default.Sensor.S5.PIN:
                        _this.emit("Sensor off", "S5");
                        ci_logmodule_1.default.write("Sensor Off " + "S5");
                        break;
                    case Global_1.default.Sensor.S6.PIN:
                        _this.emit("Sensor off", "S6");
                        ci_logmodule_1.default.write("Sensor Off " + "S6");
                        break;
                    case Global_1.default.Sensor.SM.PIN:
                        _this.emit("Sensor off", "SM");
                        ci_logmodule_1.default.write("Sensor Off " + "SM");
                        if (_this.SM == true) {
                            _this.emit("Sensor off", "SM");
                            ci_logmodule_1.default.write("Sensor Off " + "SM");
                            _this.SM = false;
                        }
                        break;
                    case Global_1.default.Pulso.P1.PIN:
                        if (_this.P1 == true) {
                            _this.emit("Input off", "P1");
                            ci_logmodule_1.default.write(" Off " + "P1");
                            _this.P1 = false;
                        }
                        break;
                    case Global_1.default.Pulso.P2.PIN:
                        if (_this.P2 == true) {
                            _this.emit("Input off", "P2");
                            ci_logmodule_1.default.write(" Off " + "P2");
                            _this.P2 = false;
                        }
                        break;
                    case Global_1.default.Pulso.P3.PIN:
                        if (_this.P3 == true) {
                            _this.emit("Input off", "P3");
                            ci_logmodule_1.default.write(" Off " + "P3");
                            _this.P3 = false;
                        }
                        break;
                    case Global_1.default.Pulso.P4.PIN:
                        if (_this.P4 == true) {
                            _this.emit("Input off", "P4");
                            ci_logmodule_1.default.write(" Off " + "P4");
                            _this.P4 = false;
                        }
                        break;
                    case Global_1.default.Pulso.P5.PIN:
                        if (_this.P5 == true) {
                            _this.emit("Input off", "P5");
                            ci_logmodule_1.default.write(" Off " + "P5");
                            _this.P5 = false;
                        }
                        break;
                    case Global_1.default.Pulso.P6.PIN:
                        if (_this.P6 == true) {
                            _this.emit("Input off", "P6");
                            ci_logmodule_1.default.write(" Off " + "P6");
                            _this.P6 = false;
                        }
                        break;
                    case Global_1.default.Aux.A1.PIN:
                        _this.emit("Aux Off", "A1");
                        break;
                    case Global_1.default.Aux.A2.PIN:
                        _this.emit("Aux Off", "A2");
                        break;
                    case Global_1.default.Card.Int.PIN:
                        _this.emit("Card Off", "Int");
                        break;
                    case Global_1.default.Card.Out.PIN:
                        _this.emit("Card Off", "Out");
                        break;
                    case Global_1.default.elevator.Up.PIN:
                        _this.emit("elevator On", "Up");
                        ci_logmodule_1.default.write(" Off " + "UP");
                        break;
                    case Global_1.default.elevator.Down.PIN:
                        _this.emit("elevator On", "Down");
                        ci_logmodule_1.default.write(" Off " + "Down");
                        break;
                    case Global_1.default.general.stop.PIN:
                        _this.emit("Stop", "off");
                        ci_logmodule_1.default.write(" Off  " + "Stop");
                        break;
                }
            }
        };
        rpi_gpio_1.default.on('change', _this.pollcbsensor);
        _this.Principal = _principal;
        return _this;
    }
    return Input;
}(events_1.default.EventEmitter));
exports.Input = Input;
