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
var Maps_1 = __importDefault(require("./Maps"));
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
        _this.goingTo = 0;
        _this.motorState = 0; //motorState: 0 stop, 1 going up, 2 going down
        //motorState 1 up
        //motorState 2 down
        _this.dispense = false;
        //Inicializa salidas
        _this.initOuts = function () {
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
            _this.Log.LogDebug("Inicializacion exitosa");
        };
        //Inicializa sensores
        _this.initSensors = function () {
            try {
                _this.Log.LogDebug("Inicializando sensores");
                //----------Sensores----------//
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S3.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S4.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S5.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.S6.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Sensor.SM.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Aux.A1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Aux.A2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Card.Int.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.Card.Out.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.elevator.Up.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.elevator.Down.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Maps_1.default.general.stop.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                _this.Log.LogDebug("Sensores listos");
            }
            catch (e) {
                _this.Log.LogError("Error al iniciar los sensores de entrada");
            }
        };
        //Deshabilita todos los sensores
        _this.closeSensors = function (cb) {
            try {
                rpi_gpio_1.default.destroy(function (err) {
                    _this.Log.LogDebug("Sensores deshabilidatos");
                    cb(err);
                });
            }
            catch (e) {
                _this.Log.LogError(e.stack + "Error detener sensores  ");
                cb(e);
            }
        };
        //Detiene todos los pines de salida
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
        //Busca la posición del elevador si no está establecida
        _this.findElevator = function () {
            Object.keys(Maps_1.default.Sensor).forEach(function (key) {
                rpi_gpio_1.default.read(Maps_1.default.Sensor[key].PIN, function (err, value) {
                    if (err != null) {
                        if (value == true) {
                            _this.Log.LogDebug("Elevador encontrado en" + Maps_1.default.Sensor[key].Piso + " On");
                            Maps_1.default.MachineLocation = Maps_1.default.Sensor[key].Piso;
                        }
                        else {
                            _this.Log.LogDebug("Elevador no encontrado en " + Maps_1.default.Sensor[key].Piso);
                        }
                    }
                    else {
                        _this.Log.LogDebug("Error al leer sensor: " + Maps_1.default.Sensor[key].GPIO);
                        _this.Log.LogDebug(Maps_1.default.Sensor[key].GPIO);
                    }
                });
            });
            if (Maps_1.default.machinelocation == null) {
                _this.Log.LogDebug("Iniciando búsqueda");
                _this.motorStartUp();
                setTimeout(function () {
                    _this.motorStop();
                    if (Maps_1.default.MachineLocation == null) {
                        _this.motorStartDown();
                        setTimeout(function () {
                            _this.motorStop();
                            if (Maps_1.default.MachineLocation == null) {
                                _this.Log.LogAlert("Elevador no pudo ser encontrado");
                            }
                        }, 1200);
                    }
                }, 1200);
            }
        };
        //Chequea posición del elevador según parámetro
        _this.checkPosition = function (pos) {
            if (Maps_1.default.machinelocation == pos) {
                return true;
            }
            else {
                return false;
            }
        };
        //Enciende el motor del elevador hacia abajo
        _this.motorStartDown = function () {
            try {
                if (_this.checkPosition(Maps_1.default.row.M.Piso)) {
                    _this.Log.LogDebug("El Elevador está al limite inferior, no puede bajar mas");
                }
                else {
                    _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                    _this.motorState = 2;
                    _this.Log.LogDebug("Elevador Bajando");
                }
            }
            catch (e) {
                _this.Log.LogError("Error al bajar ascensor" + e.stack);
            }
        };
        //Enciende el motor del elevador hacia arriba
        _this.motorStartUp = function () {
            try {
                if (_this.checkPosition(Maps_1.default.row.A.Piso)) {
                    _this.Log.LogDebug("El Elevador está al limite superior, no puede subir mas");
                }
                else {
                    _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                    _this.motorState = 1;
                    _this.Log.LogDebug("Elevador subiendo");
                }
            }
            catch (e) {
                _this.Log.LogError("Error al subir ascensor" + e.stack);
            }
        };
        //Detiene el motor del elevador
        _this.motorStop = function () {
            try {
                _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.Down.value, _this.mcp2.LOW);
                _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.UP.value, _this.mcp2.LOW);
                _this.motorState = 0;
                _this.Log.LogDebug("Elevador detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
        //Inicia el motor de una cinta específica
        _this.motorCintaStart = function (row, coll) {
            try {
                async_1.default.parallel([function () {
                        _this.mcp1.digitalWrite(row, _this.mcp2.HIGH);
                    }, function () {
                        _this.mcp1.digitalWrite(coll, _this.mcp2.HIGH);
                    }]);
                _this.Log.LogDebug("Motor de celda activado");
            }
            catch (e) {
                _this.Log.LogError("Error al activar celda" + e.stack);
            }
        };
        //Detiene el motor de una cinta específica
        _this.motorCintaStop = function (row, coll) {
            try {
                async_1.default.parallel([function () {
                        _this.mcp1.digitalWrite(row, _this.mcp2.LOW);
                    }, function () {
                        _this.mcp1.digitalWrite(coll, _this.mcp2.LOW);
                    }]);
                _this.Log.LogDebug("Motor de celda detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al activar celda" + e.stack);
            }
        };
        //Recibe señal de entrada y determina de donde proviene
        _this.signal = function (pin, state) {
            if (state === true) {
                switch (pin) {
                    case Maps_1.default.Sensor.S1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S1 On");
                            Maps_1.default.machinelocation = 1;
                            if (_this.goingTo == Maps_1.default.machinelocation || _this.motorState == 1) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S1 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.S2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S2 On");
                            Maps_1.default.machinelocation = 2;
                            if (_this.goingTo == Maps_1.default.machinelocation || _this.motorState == 1) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S2 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.S3.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S3 On");
                            Maps_1.default.machinelocation = 3;
                            if (_this.goingTo == Maps_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S3 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.S4.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S4 On");
                            Maps_1.default.machinelocation = 4;
                            if (_this.goingTo == Maps_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S4 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.S5.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S5 On");
                            Maps_1.default.machinelocation = 5;
                            if (_this.goingTo == Maps_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S5 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.S6.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S6 On");
                            Maps_1.default.machinelocation = 6;
                            if (_this.goingTo == Maps_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S6 Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Sensor.SM.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor SM On");
                            Maps_1.default.machinelocation = 7;
                            if (_this.goingTo == Maps_1.default.machinelocation || _this.motorState == 2) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor SM Off");
                        }
                        _this.emit("Sensor", Maps_1.default.machinelocation, state);
                        break;
                    case Maps_1.default.Pulso.P1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 1");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 1");
                        }
                        break;
                    case Maps_1.default.Pulso.P2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 2");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 2");
                        }
                        break;
                    case Maps_1.default.Pulso.P3.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 3");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 3");
                        }
                        break;
                    case Maps_1.default.Pulso.P4.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 4");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 4");
                        }
                        break;
                    case Maps_1.default.Pulso.P5.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 5");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 5");
                        }
                        break;
                    case Maps_1.default.Pulso.P6.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor vuelta piso 6");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor vuelta piso 6");
                        }
                        break;
                    case Maps_1.default.Aux.A1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor Aux A1");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor Aux A1");
                        }
                        break;
                    case Maps_1.default.Aux.A2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso On sensor Aux A2");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Off sensor Aux A2");
                        }
                        break;
                    case Maps_1.default.Card.Int.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso Card In On");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Card In Off");
                        }
                        break;
                    case Maps_1.default.Card.Out.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Pulso Card Out On");
                        }
                        else {
                            _this.Log.LogDebug("Pulso Card Out Off");
                        }
                        break;
                    case Maps_1.default.elevator.Up.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador subiendo???");
                        }
                        else {
                            _this.Log.LogDebug("Elevador detuvo subida?");
                        }
                        break;
                    case Maps_1.default.elevator.Down.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador bajando???");
                        }
                        else {
                            _this.Log.LogDebug("Elevador detuvo bajada?");
                        }
                        break;
                    case Maps_1.default.general.stop.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Elevador se detuvo??");
                        }
                        else {
                            _this.Log.LogDebug("Elevador se mueve??");
                        }
                }
            }
        };
        //Enviar el elevador a una fila específica
        _this.GoTo = function (row) {
            _this.goingTo = row;
            if (Maps_1.default.machinelocation == row) {
                _this.Log.LogDebug("El elevador esta en posición");
            }
            else {
                if (Maps_1.default.machinelocation > row) {
                    _this.motorStartUp();
                }
                else if (Maps_1.default.machinelocation < row) {
                    _this.motorStartDown();
                }
            }
        };
        //Espera a que el elevador se ubique en la posición deseada
        _this.waitPosition = function (callback, piso) {
            _this.Log.LogDebug("Esperando posición de elevador");
            var wait = setInterval(function () {
                if (Maps_1.default.machinelocation == piso) {
                    clearInterval(wait);
                    _this.Log.LogDebug("Elevador llego a la posición");
                    callback(null);
                }
            }, 150);
        };
        //Prepara y ajusta posición del elevador para recibir artículo
        _this.prepareForDispense = function (callback, height) {
            var timeForDown = height * 17;
            if (_this.checkPosition(Maps_1.default.machinelocation)) {
                _this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
                _this.motorStartDown();
                setTimeout(function () {
                    _this.motorStop();
                    _this.Log.LogDebug("Elevador ubicado y listo para recibir");
                    callback(null);
                }, timeForDown);
            }
            else {
                _this.Log.LogError("El elevador no está en posición para recibir");
            }
        };
        //Enciende cinta específica para dispensar un artículo
        _this.receiveItem = function (callback, row, coll) {
            _this.motorCintaStart(row, coll);
            _this.on("Sensor", function () {
                _this.motorCintaStop(row, coll);
                _this.Log.LogDebug("Articulo recibido en el elevador");
                callback(null);
            });
        };
        //Proceso completo para dispensar artículo al cliente
        _this.dispenseItem = function (piso, row, coll, height) {
            _this.Log.LogDebug("Comenzando proceso de dispensar item");
            async_1.default.series([
                function (callback) {
                    _this.Log.LogDebug("Step 1 Ubicando elevador en posición");
                    _this.GoTo(piso);
                    callback(null);
                },
                function (callback) {
                    _this.Log.LogDebug("Step 2 Esperando la posicion del elevador");
                    _this.waitPosition(callback, piso);
                },
                function (callback) {
                    _this.Log.LogDebug("Step 3 Ajustando posición del elevador segun tamaño");
                    _this.prepareForDispense(callback, 14);
                },
                function (callback) {
                    _this.Log.LogDebug("Step 4 Dispensado artículo desde cinta");
                    _this.receiveItem(callback, row, coll);
                },
                function (callback) {
                    _this.Log.LogDebug("Step 5 Bajando elevador para realizar entrega");
                    _this.GoTo(7);
                    callback(null);
                },
            ], function (callback) {
                if (!callback) {
                    console.log("Entrega Completa");
                }
                else {
                    console.log("error");
                }
            });
        };
        _this.Log.LogDebug("Control inicializado");
        rpi_gpio_1.default.on('change', _this.signal);
        _this.initOuts();
        _this.initSensors();
        if (Maps_1.default.machinelocation == null) {
            _this.findElevator();
        }
        return _this;
    }
    return ControllerMachine;
}(events_1.default));
exports.ControllerMachine = ControllerMachine;
