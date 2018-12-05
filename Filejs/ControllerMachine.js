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
var Global_1 = __importDefault(require("./Global"));
var node_mcp23017_with_i2c_updated_1 = __importDefault(require("node-mcp23017_with_i2c_updated"));
var events_1 = __importDefault(require("events"));
var rpi_gpio_1 = __importDefault(require("rpi-gpio"));
var async_1 = __importDefault(require("async"));
var ci_syslogs_1 = require("ci-syslogs");
var ControllerMachine = /** @class */ (function (_super) {
    __extends(ControllerMachine, _super);
    function ControllerMachine() {
        var _this = _super.call(this) || this;
        _this.Log = new ci_syslogs_1.Logger("0.0.0.0", ci_syslogs_1.Logger.Facilities.Machine);
        _this.mcp1 = new node_mcp23017_with_i2c_updated_1.default({
            address: 0x20,
            device: '/dev/i2c-1',
            debug: true
        });
        _this.mcp2 = new node_mcp23017_with_i2c_updated_1.default({
            address: 0x21,
            device: '/dev/i2c-1',
            debug: true
        });
        _this.position = {
            P6: { value: false },
            P5: { value: false },
            P4: { value: false },
            P3: { value: false },
            P2: { value: false },
            P1: { value: false },
            P0: { value: false }
        };
        _this.initOuts = function (cb) {
            _this.Log.LogDebug("Inicializando salidas");
            for (var i = 0; i < 16; i++) {
                try {
                    _this.mcp1.pinMode(i, _this.mcp1.OUTPUT);
                    _this.Log.LogDebug("Pin " + i + " de MPC1 Inicializado");
                }
                catch (e) {
                    _this.Log.LogError("Error al inicializar Pin: " + i + " de MCP1");
                }
                try {
                    _this.mcp2.pinMode(i, _this.mcp2.OUTPUT);
                    _this.Log.LogDebug("Pin " + i + " de MPC2 Inicializado");
                }
                catch (e) {
                    _this.Log.LogError("Error al inicializar Pin: " + i + " de MCP2");
                }
            }
            cb(null, "inicialización A y B exitosa");
        };
        _this.stopAll = function () {
            _this.Log.LogDebug("Deteniendo toda la máquina");
            for (var i = 0; i < 16; i++) {
                try {
                    _this.mcp1.digitalWrite(i, _this.mcp1.LOW);
                    _this.Log.LogDebug("Pin " + i + " de MPC1 Detenido");
                }
                catch (e) {
                    _this.Log.LogError("Error al detener Pin: " + i + " de MCP1");
                }
                try {
                    _this.mcp2.digitalWrite(i, _this.mcp2.LOW);
                    _this.Log.LogDebug("Pin " + i + " de MPC2 Detenido");
                }
                catch (e) {
                    _this.Log.LogError("Error al detener Pin: " + i + " de MCP2");
                }
            }
        };
        _this.motorStartDown = function (cb) {
            try {
                if (_this.position.P0.value == true) {
                    _this.Log.LogDebug("El Elevador está en la PO, no puede bajar mas");
                }
                else {
                    _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                    _this.Log.LogDebug("Elevador subiendo");
                }
            }
            catch (e) {
                _this.Log.LogError("Error al subir ascensor" + e.stack);
            }
        };
        _this.motorStopDown = function (cb) {
            try {
                _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.Down.value, _this.mcp2.LOW);
                _this.Log.LogDebug("Elevador detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
        _this.motorStartUp = function (cb) {
            try {
                if (_this.position.P0.value == true) {
                    _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                    _this.Log.LogDebug("Elevador subiendo");
                }
                else {
                    _this.motorStartDown(function (callback) {
                    });
                }
            }
            catch (e) {
                _this.Log.LogError("Error al subir ascensor" + e.stack);
            }
        };
        _this.motorStopUp = function (cb) {
            try {
                _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.UP.value, _this.mcp2.LOW);
                _this.Log.LogDebug("Elevador detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
        _this.motorCinta = function (row, coll, cb) {
            try {
                async_1.default.parallel([function () {
                        _this.mcp1.digitalWrite(row, _this.mcp2.HIGH);
                    }, function () {
                        _this.mcp1.digitalWrite(coll, _this.mcp2.HIGH);
                    }]);
                _this.Log.LogDebug("Motor de celda activada");
            }
            catch (e) {
                _this.Log.LogError("Error al activar celda" + e.stack);
            }
        };
        _this.signal = function (pin, state) {
            if (state === true) {
                switch (pin) {
                    case Global_1.default.Sensor.S1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S1 On");
                            _this.position.P1.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S1 Off");
                            _this.position.P1.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.S2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S2 On");
                            _this.position.P2.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S2 Off");
                            _this.position.P2.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.S3.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S3 On");
                            _this.position.P3.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S3 Off");
                            _this.position.P3.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.S4.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S4 On");
                            _this.position.P4.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S4 Off");
                            _this.position.P4.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.S5.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S5 On");
                            _this.position.P5.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S5 Off");
                            _this.position.P5.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.S6.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S6 On");
                            _this.position.P6.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor S6 Off");
                            _this.position.P6.value = false;
                        }
                        break;
                    case Global_1.default.Sensor.SM.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor SM On");
                            _this.position.P0.value = true;
                        }
                        else {
                            _this.Log.LogDebug("Sensor SM Off");
                            _this.position.P0.value = false;
                        }
                        break;
                    case Global_1.default.Pulso.P1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 1");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 1");
                        }
                        break;
                    case Global_1.default.Pulso.P2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 2");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 2");
                        }
                        break;
                    case Global_1.default.Pulso.P3.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 3");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 3");
                        }
                        break;
                    case Global_1.default.Pulso.P4.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 4");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 4");
                        }
                        break;
                    case Global_1.default.Pulso.P5.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 5");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 5");
                        }
                        break;
                    case Global_1.default.Pulso.P6.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 6");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 6");
                        }
                        break;
                    case Global_1.default.Aux.A1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor Aux A1");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor Aux A1");
                        }
                        break;
                    case Global_1.default.Aux.A2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor Aux A2");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor Aux A2");
                        }
                        break;
                    case Global_1.default.Card.Int.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso Card In On");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Card In Off");
                        }
                        break;
                    case Global_1.default.Card.Out.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso Card Out On");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Card Out Off");
                        }
                        break;
                    case Global_1.default.elevator.Up.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador subiendo???");
                        }
                        else {
                            _this.Log.LogDebug("Elevador detuvo subida?");
                        }
                        break;
                    case Global_1.default.elevator.Down.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador bajando???");
                        }
                        else {
                            _this.Log.LogDebug("Elevador detuvo bajada?");
                        }
                        break;
                    case Global_1.default.general.stop.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador se detuvo??");
                        }
                        else {
                            _this.Log.LogDebug("Elevador se mueve?");
                        }
                }
            }
        };
        _this.Log.LogDebug("Control inicializado");
        rpi_gpio_1.default.on('change', _this.signal);
        return _this;
    }
    return ControllerMachine;
}(events_1.default));
exports.ControllerMachine = ControllerMachine;
