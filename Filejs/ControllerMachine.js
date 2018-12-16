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
var Sensor_1 = require("./Sensor");
var Global_1 = __importDefault(require("./Global"));
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
        //Controla el destino del elevador al moverlo
        _this.goingTo = 0;
        //Controla el estado del motor. motorState: [0 stop, 1 going up, 2 going down]
        _this.motorState = 0;
        //Indica la posición actual del elevador
        _this.location = null;
        //motorState 1 up
        //motorState 2 down
        _this.receivingItem = false;
        _this.isDelivery = false;
        _this.enableMachine = false;
        //Estado de la máquina, si esta inactiva o en una operación
        _this.estatemachine = false;
        //Habilita o deshabilita seguridad
        _this.securityState = function (state) {
            _this.estatemachine = state;
            _this.Log.LogDebug("La seguridad esta en: " + state);
        };
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
        _this.findElevator = function (callback) {
            //Proceso de busqueda de elevador
            if (_this.location == null) {
                _this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
                _this.motorStartUp();
                _this.once("Sensor", function (piso, state) {
                    if (state == true) {
                        _this.Log.LogDebug("Deteccion de elevador en: " + piso);
                        _this.location = piso;
                        _this.motorStop();
                    }
                });
                //Mueve el elevador para conseguir ubicación
                setTimeout(function () {
                    _this.motorStop();
                    if (_this.location == null) {
                        _this.motorStartDown();
                        setTimeout(function () {
                            if (_this.location == null) {
                                _this.Log.LogAlert("Elevador no pudo ser encontrado");
                                callback("Error - El elevador no pudo ser encontrado");
                            }
                            _this.motorStop();
                        }, 2000);
                    }
                    else {
                        _this.Log.LogDebug("Elevador encontrado en el piso: " + _this.location);
                        _this.gotoInitPosition(callback);
                    }
                }, 2500);
            }
            else {
                _this.Log.LogDebug("Elevador encontrado en el piso: " + _this.location);
                callback(null);
            }
        };
        //Chequea posición del elevador según parámetro
        _this.checkPosition = function (pos) {
            if (_this.location == pos) {
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
                _this.goingTo = 0;
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
        //Inicia el motor de una cinta específica
        _this.motorCintaStart = function (row, coll, coll2) {
            try {
                async_1.default.parallel([function () {
                        _this.mcp1.digitalWrite(Number(row), _this.mcp1.HIGH);
                    }, function () {
                        _this.mcp1.digitalWrite(Number(coll), _this.mcp1.HIGH);
                    }, function () {
                        if (coll2 != null) {
                            _this.mcp1.digitalWrite(Number(coll2), _this.mcp1.HIGH);
                        }
                    }]);
                _this.Log.LogDebug("Motor de celda activado");
            }
            catch (e) {
                _this.Log.LogError("Error al activar celda" + e.stack);
            }
        };
        //Detiene el motor de una cinta específica
        _this.motorCintaStop = function (row, coll, coll2) {
            try {
                async_1.default.parallel([function () {
                        _this.mcp1.digitalWrite(Number(row), _this.mcp1.LOW);
                    }, function () {
                        _this.mcp1.digitalWrite(Number(coll), _this.mcp1.LOW);
                    }, function () {
                        if (coll2 != null) {
                            _this.mcp1.digitalWrite(Number(coll2), _this.mcp1.LOW);
                        }
                    }]);
                _this.Log.LogDebug("Motor de celda detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al activar celda" + e.stack);
            }
        };
        //Recibe señal de entrada y determina de donde proviene
        _this.signal = function (pin, state) {
            switch (pin) {
                case Maps_1.default.Sensor.S1.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S1 On");
                        if (_this.motorState != 0) {
                            _this.location = 1;
                        }
                        if (_this.goingTo == _this.location || _this.motorState == 1) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 2 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 2 - Se detectó el elevador en la posición 1");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S1 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.S2.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S2 On");
                        if (_this.motorState != 0) {
                            _this.location = 2;
                        }
                        if (_this.goingTo == _this.location) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 3 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 3 - Se detectó el elevador en la posición 2");
                            _this.motorStop();
                        }
                        if (_this.goingTo == 1 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 1 - Se detectó el elevador en la posición 2");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S2 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.S3.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S3 On");
                        if (_this.motorState != 0) {
                            _this.location = 3;
                        }
                        if (_this.goingTo == _this.location) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 4 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 4 - Se detectó el elevador en la posición 3");
                            _this.motorStop();
                        }
                        if (_this.goingTo == 2 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 2 - Se detectó el elevador en la posición 3");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S3 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.S4.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S4 On");
                        if (_this.motorState != 0) {
                            _this.location = 4;
                        }
                        if (_this.goingTo == _this.location) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 5 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 5 - Se detectó el elevador en la posición 4");
                            _this.motorStop();
                        }
                        if (_this.goingTo == 3 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 3 - Se detectó el elevador en la posición 4");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S4 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.S5.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S5 On");
                        if (_this.motorState != 0) {
                            _this.location = 5;
                        }
                        if (_this.goingTo == _this.location) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 6 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 6 - Se detectó el elevador en la posición 5");
                            _this.motorStop();
                        }
                        if (_this.goingTo == 4 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 4 - Se detectó el elevador en la posición 5");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S5 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.S6.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor S6 On");
                        if (_this.motorState != 0) {
                            _this.location = 6;
                        }
                        if (_this.goingTo == _this.location) {
                            _this.motorStop();
                        }
                        if (_this.goingTo == 7 && _this.motorState == 1) {
                            _this.Log.LogAlert("Se paso de posición 7 - Se detectó el elevador en la posición 6");
                            _this.motorStop();
                        }
                        if (_this.goingTo == 5 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 5 - Se detectó el elevador en la posición 6");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor S6 Off");
                    }
                    if (_this.receivingItem) {
                        _this.emit("Item recibido", _this.location, state);
                    }
                    _this.emit("Sensor", _this.location, state);
                    break;
                case Maps_1.default.Sensor.SM.PIN:
                    if (state === true) {
                        _this.Log.LogDebug("Sensor SM On");
                        if (_this.motorState != 0) {
                            _this.location = 7;
                        }
                        if (_this.goingTo == _this.location || _this.motorState == 2) {
                            if (_this.isDelivery == true) {
                                setTimeout(function () {
                                    _this.motorStop();
                                }, 200);
                            }
                            else {
                                _this.motorStop();
                            }
                        }
                        if (_this.goingTo == 6 && _this.motorState == 2) {
                            _this.Log.LogAlert("Se paso de posición 6 - Se detectó el elevador en la posición 7");
                            _this.motorStop();
                        }
                    }
                    else {
                        _this.Log.LogDebug("Sensor SM Off");
                    }
                    _this.emit("Sensor", _this.location, state);
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
                    if (state === false) {
                        _this.Log.LogDebug("Elevador subiendo de forma manual");
                        _this.securityState(false);
                        //this.motorStartUp();
                        _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                    }
                    else {
                        _this.Log.LogDebug("Elevador detuvo subida manual");
                        _this.motorStop();
                        _this.securityState(true);
                    }
                    break;
                case Maps_1.default.elevator.Down.PIN:
                    if (state === false) {
                        _this.Log.LogDebug("Elevador bajando de forma manual");
                        _this.securityState(false);
                        //this.motorStartDown()
                        _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                    }
                    else {
                        _this.Log.LogDebug("Elevador detuvo bajada manual");
                        _this.motorStop();
                        _this.securityState(true);
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
        };
        //Enviar el elevador a una fila específica
        _this.GoTo = function (callback, row) {
            _this.securityState(false);
            _this.Log.LogDebug("Elevador se dirige a la posición: " + row);
            _this.goingTo = row;
            if (_this.checkPosition(row)) {
                _this.Log.LogDebug("El elevador esta en posición");
                callback(null);
            }
            else {
                if (_this.location > row) {
                    _this.motorStartUp();
                }
                else if (_this.location < row) {
                    _this.motorStartDown();
                }
                _this.Log.LogDebug("Esperando posición del elevador");
                //v5
                var atasco_1 = false;
                var time_1 = 0;
                //Espera la posición de destino
                var wait_1 = setInterval(function () {
                    time_1 += 100;
                    if (_this.checkPosition(row)) {
                        _this.Log.LogDebug("Elevador llego a la posición");
                        clearInterval(wait_1);
                        wait_1 = null;
                        callback(null);
                    }
                    if (time_1 > 12000) {
                        _this.Log.LogDebug("Error de atasco despues de 12 segundos");
                        clearInterval(wait_1);
                        _this.motorStop();
                        wait_1 = null;
                        callback("Error de atasco despues de 12 segundos");
                    }
                }, 100);
            }
        };
        //Prepara y ajusta posición del elevador para recibir artículo
        _this.prepareForDispense = function (callback, height) {
            var timeForDown = height * 13;
            if (_this.checkPosition(_this.location)) {
                _this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
                _this.motorStartDown();
                setTimeout(function () {
                    _this.motorStop();
                    _this.Log.LogDebug("Elevador ubicado y listo para recibir");
                    _this.receivingItem = true;
                    callback(null);
                }, timeForDown);
            }
            else {
                _this.Log.LogError("El elevador no está en posición para recibir");
            }
        };
        //Tiempo de espera para que el cliente retire el producto
        _this.waitForRemoveItem = function (callback) {
            setTimeout(function () {
                if (Global_1.default.Is_empty == false) {
                    _this.Log.LogDebug("Hay un producto en el elevador para retirar");
                    var wait_2 = setInterval(function () {
                        if (Global_1.default.Is_empty) {
                            callback(null);
                            clearInterval(wait_2);
                            wait_2 = null;
                        }
                    }, 500);
                }
                else {
                    _this.Log.LogDebug("No Hay producto en el elevador, se ajustará en 30s");
                    setTimeout(function () {
                        callback(null);
                    }, 22000);
                }
            }, 1000);
        };
        //Proceso completo para dispensar artículo al cliente
        _this.dispenseItem = function (piso, c1, c2, height, callback) {
            _this.Log.LogDebug("Comenzando proceso de dispensar item en el piso " + piso);
            _this.securityState(false);
            if (_this.enableMachine) {
                _this.Log.LogDebug("Comenzando proceso de dispensar item");
                async_1.default.series([
                    function (callback) {
                        _this.Log.LogDebug("Step 1 Verificando posición de elevador");
                        if (_this.checkPosition(7)) {
                            callback(null);
                        }
                        else {
                            _this.findElevator(callback);
                        }
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 2 Ubicando elevador en posición");
                        _this.GoTo(callback, piso);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 3 Ajustando posición del elevador segun tamaño");
                        setTimeout(function () {
                            _this.prepareForDispense(callback, height);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 4 Dispensado artículo desde cinta");
                        setTimeout(function () {
                            _this.dispense(piso, c1, c2, callback);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 5 Bajando elevador para realizar entrega");
                        _this.receivingItem = false;
                        _this.isDelivery = true;
                        _this.GoTo(callback, 7);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 6 Esperando evento del retiro del articulo");
                        _this.emit("Event", { cmd: "Ok_dispensing", data: true });
                        _this.waitForRemoveItem(callback);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 7 Asegurando puerta");
                        setTimeout(function () {
                            _this.gotoInitPosition(callback);
                        }, 8000);
                    }
                ], function (result) {
                    _this.receivingItem = false;
                    if (result == null) {
                        _this.Log.LogDebug('Proceso de venta completo ' + result);
                        callback(result);
                    }
                    else {
                        _this.Log.LogAlert("Error: " + result);
                        _this.stopAll();
                        callback(result);
                    }
                });
            }
            else {
                callback("Máquina deshabilitada por falla en sensor serial");
            }
        };
        //Obtiene los pines de los motores de las celdas
        _this.findRow = function (row, col_1, col_2, callback) {
            _this.Log.LogDebug("Buscando pines");
            var coll;
            var coll2 = null;
            var r;
            try {
                async_1.default.mapSeries(Global_1.default.MCP_Columna, function (Columna, cb) {
                    if (Columna.ID.toString() == col_1) {
                        coll = Columna.value;
                    }
                    cb(null);
                }, function (err, data) {
                    async_1.default.mapSeries(Global_1.default.MCP_Columna, function (Columna, cb) {
                        if (Columna.ID.toString() == col_2) {
                            coll2 = Columna.value;
                        }
                        cb(null);
                    }, function (err, data) {
                        async_1.default.mapSeries(Global_1.default.MCP_row, function (Row, cb) {
                            if (Row.ID.toString() == row) {
                                r = Row.value;
                            }
                            cb(null);
                        }, function (err, data) {
                            callback(null, r, coll, coll2);
                        });
                    });
                });
            }
            catch (e) {
                _this.Log.LogError(e.stack + 'error seleccionando columna');
            }
        };
        //Ubicar el elevador en la posición inicial
        _this.gotoInitPosition = function (callback) {
            _this.Log.LogDebug("InitPos - Elevador va a posición inicial");
            async_1.default.series([
                //Step 1 - Ubicando elevador en posicion 7
                function (callback) {
                    _this.Log.LogDebug("InitPos - Ubicando elevador en la parte inferior, piso 7");
                    _this.GoTo(callback, 7);
                },
                //Step 2 - Ajustando altura de Elevador
                function (callback) {
                    _this.Log.LogDebug("InitPos - Ajustando altura para bloqueo de puerta principal");
                    _this.motorStartUp();
                    setTimeout(function () {
                        _this.motorStop();
                        _this.Log.LogDebug("InitPos - Elevador ubicado en posición inicial");
                        _this.securityState(true);
                        callback(null);
                    }, 400);
                }
            ], function (result) {
                if (result == null) {
                    _this.Log.LogDebug('InitPos - Elevador ubicado correctamente ' + result);
                    _this.securityState(true);
                    callback(null);
                }
                else {
                    _this.Log.LogAlert("Error ubicando en la posición inicial");
                    callback(result);
                }
            });
        };
        //Beta de dispensar
        _this.dispense = function (piso, coll_1, coll_2, callback) {
            _this.findRow(piso, coll_1, coll_2, function (err, row, c1, c2) {
                _this.Log.LogDebug("Dispensando desde piso " + piso + " columna 1: " + c1 + " columna 2+ " + c2);
                _this.Log.LogDebug("Dispensado artículo desde cinta");
                _this.motorCintaStart(row, c1, c2);
                _this.receivingItem = true;
                _this.once("Item recibido", function () {
                    console.log("Articulo recibido");
                    _this.motorCintaStop(row, coll_1, coll_2);
                    _this.receivingItem = false;
                    callback(null);
                });
            });
        };
        //Test celdas
        _this.testCeldas = function (piso, coll_1, coll_2, callback) {
            _this.findRow(piso, coll_1, coll_2, function (err, row, c1, c2) {
                _this.Log.LogDebug("Iniciando test de celda");
                _this.motorCintaStart(row, c1, c2);
                setTimeout(function () {
                    _this.motorCintaStop(row, coll_1, coll_2);
                    console.log("Test de celda finalizado");
                    callback(null);
                }, 4000);
            });
        };
        //**************************Beta*******************************!//
        //Control de atascos - Probar
        _this.atasco = false;
        _this.intentos = 0;
        //Controla el tiempo de avance del motor
        _this.controlTime = function (row, callback) {
            //Espera la posición de destino
            var nPisos = _this.location - _this.goingTo;
            var time = 0;
            var countTime = 500;
            if (nPisos < 0) {
                nPisos = nPisos * -1;
            }
            time = nPisos * 2000;
            _this.Log.LogDebug("Se movera " + nPisos + " en un tiempo límite para llegar a destino es " + time);
            //Espera la posición de destino
            var wait = setInterval(function () {
                console.log(countTime);
                countTime = countTime + 100;
                if (_this.location == _this.goingTo) {
                    _this.Log.LogDebug("Elevador llego en: " + countTime);
                    clearInterval(wait);
                    wait = null;
                    callback(null);
                }
                if (countTime > time) {
                    _this.Log.LogDebug("Leyendo posible atasco, countTime: " + countTime);
                    _this.controlAtasco(_this.motorState, callback);
                    clearInterval(wait);
                    wait = null;
                }
            }, 100);
        };
        //Controla intentos de desatascos del elevador
        _this.controlAtasco = function (callback, row) {
            _this.atasco = true;
            _this.intentos++;
            if (_this.intentos > 3) {
                _this.Log.LogCritical("Elevador atascado luego de 3 intentos - Se requiere revisión");
                callback("Elevador atascado luego de 3 intentos - Se requiere revisión");
            }
            else {
                _this.Log.LogAlert("Intento de desatasco número :" + _this.intentos);
                _this.Log.LogDebug("Comenzando proceso de desatasco número: " + _this.intentos);
                if (_this.motorState == 1) {
                    _this.Log.LogDebug("Bajando para desatascar");
                    _this.motorStartDown();
                    setTimeout(function () {
                        _this.motorStop();
                        setTimeout(function () {
                            _this.GoTo(callback, row);
                            //callback(null)
                        }, 1500);
                    }, 1500);
                }
                else {
                    _this.Log.LogDebug("Subiendo para desatascar");
                    _this.motorStartUp;
                    setTimeout(function () {
                        _this.motorStop();
                        setTimeout(function () {
                            _this.GoTo(callback, row);
                            //callback(null)
                        }, 1500);
                    }, 1500);
                }
            }
        };
        //Enviar el elevador a una fila específica con control de atascos
        _this.GoTo2 = function (callback, row) {
            _this.securityState(false);
            _this.Log.LogDebug("Elevador se dirige a la posición: " + row);
            _this.goingTo = row;
            if (_this.location == row) {
                _this.Log.LogDebug("El elevador esta en posición");
                callback(null);
            }
            else {
                if (_this.location > row) {
                    _this.motorStartUp();
                }
                else if (_this.location < row) {
                    _this.motorStartDown();
                }
                //Espera la posición de destino y verifica atascos
                _this.controlTime(row, callback);
            }
        };
        _this.Log.LogDebug("Control inicializado");
        rpi_gpio_1.default.on('change', _this.signal);
        _this.on("Sensor", function (pin, state) {
            if (_this.estatemachine == true && pin != Maps_1.default.elevator.Up.PIN && pin != Maps_1.default.elevator.Down.PIN) {
                _this.Log.LogAlert("Alerta, sensor activado cuando la máquina está inactiva pin: " + pin);
                _this.emit("Event", { cmd: "Alerta" });
            }
        });
        _this.initOuts();
        _this.initSensors();
        _this.sensorPiso = new Sensor_1.Sensor();
        _this.Log.LogDebug("chequeando serial");
        setTimeout(function () {
            if (_this.sensorPiso.isCheck == true) {
                _this.Log.LogDebug("Máquina habilitada");
                _this.enableMachine = true;
                _this.securityState(false);
                _this.emit("Event", { cmd: "Maquina_Lista" });
                if (_this.location == null) {
                    _this.findElevator(function (cb) {
                        _this.Log.LogDebug("Fin de proceso de busqueda de elevador");
                    });
                }
            }
            else {
                _this.emit("Event", { cmd: "Error_puerto_serial" });
            }
        }, 5000);
        return _this;
    }
    return ControllerMachine;
}(events_1.default));
exports.ControllerMachine = ControllerMachine;
