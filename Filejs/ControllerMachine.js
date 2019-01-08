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
var ConfigMachine_1 = __importDefault(require("./ConfigMachine"));
var node_mcp23017_with_i2c_updated_1 = __importDefault(require("node-mcp23017_with_i2c_updated"));
var events_1 = require("events");
var rpi_gpio_1 = __importDefault(require("rpi-gpio"));
var async_1 = __importDefault(require("async"));
var ci_syslogs_1 = require("ci-syslogs");
var Sensor_1 = require("./Sensor");
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
        //Variables de control de la máquina
        _this.stateMachine = {
            goingTo: 0,
            motorState: 0,
            location: null,
            sensorPiso: null,
            receivingItem: false,
            isDelivery: false,
            isDispense: false,
            enableMachine: false,
            securityMachine: false,
            initPosition: false,
            blokingType: 0,
            attempts: 0,
            findProcess: false,
            pollProcess: false,
            readyForDispense: true,
            timeSettingAdjust: 16,
            countTime: 100,
            timeToDisepense: 100
        };
        //Habilita o deshabilita seguridad
        _this.securityState = function (state) {
            _this.stateMachine.securityMachine = state;
            _this.Log.WriteLog("La seguridad está en: " + _this.stateMachine.securityMachine, ci_syslogs_1.Logger.Severities.Debug);
        };
        //Inicializa salidas
        _this.initOuts = function () {
            _this.Log.WriteLog("Inicializando salidas", ci_syslogs_1.Logger.Severities.Debug);
            for (var i = 0; i < 16; i++) {
                try {
                    _this.mcp1.pinMode(i, _this.mcp1.OUTPUT);
                    _this.Log.WriteLog("Pin " + i + " de MPC1 Inicializado", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    _this.Log.WriteLog("Error al inicializar Pin: " + i + " de MCP1", ci_syslogs_1.Logger.Severities.Error);
                }
                try {
                    _this.mcp2.pinMode(i, _this.mcp2.OUTPUT);
                    _this.Log.WriteLog("Pin " + i + " de MPC2 Inicializado", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    _this.Log.WriteLog("Error al inicializar Pin: " + i + " de MCP2", ci_syslogs_1.Logger.Severities.Error);
                }
            }
            _this.Log.WriteLog("Inicialización exitosa", ci_syslogs_1.Logger.Severities.Debug);
        };
        //Inicializa sensores
        _this.initSensors = function (callback) {
            try {
                _this.Log.WriteLog("Inicializando Sensores", ci_syslogs_1.Logger.Severities.Debug);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[1].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[2].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[3].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[4].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[5].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[6].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.Sensor[7].PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_RISING);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.elevator.Up.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.elevator.Down.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(ConfigMachine_1.default.general.stop.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                //Gpio.setup(Config.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Config.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Config.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Config.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                _this.Log.WriteLog("Sensores Listos", ci_syslogs_1.Logger.Severities.Debug);
                callback(null);
            }
            catch (e) {
                _this.Log.WriteLog("Error al iniciar los sensores de entrada", ci_syslogs_1.Logger.Severities.Error);
                callback("Error al iniciar los sensores de entrada. " + e.stackTrace);
            }
        };
        //Resetear sensores
        _this.resetSensors = function (callback) {
            async_1.default.series([
                function (callback) {
                    _this.closeSensors(callback);
                },
                function (callback) {
                    _this.initSensors(callback);
                }
            ], function (result) {
                if (result == null) {
                    callback(result);
                    _this.Log.WriteLog('Sensores Reiniciados ' + result, ci_syslogs_1.Logger.Severities.Debug);
                }
                else {
                    callback(result);
                    _this.Log.WriteLog("Error: " + result, ci_syslogs_1.Logger.Severities.Error);
                }
            });
        };
        //Deshabilita todos los sensores
        _this.closeSensors = function (callback) {
            try {
                rpi_gpio_1.default.destroy(function (err) {
                    if (err == null) {
                        _this.Log.WriteLog("Sensores deshabilidatos", ci_syslogs_1.Logger.Severities.Debug);
                        callback(null);
                    }
                });
            }
            catch (e) {
                _this.Log.WriteLog(e.stack + "Error detener sensores ", ci_syslogs_1.Logger.Severities.Error);
                callback(e);
            }
        };
        //Detiene todos los pines de salida
        _this.stopAll = function (callback) {
            _this.Log.WriteLog("Deteniendo salidas", ci_syslogs_1.Logger.Severities.Debug);
            for (var i = 0; i < 16; i++) {
                try {
                    _this.mcp1.digitalWrite(i, _this.mcp1.LOW);
                    _this.Log.WriteLog("Pin " + i + " de MPC1 Detenido", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    _this.Log.WriteLog("Error al detener Pin: " + i + " de MCP1", ci_syslogs_1.Logger.Severities.Error);
                }
                try {
                    _this.mcp2.digitalWrite(i, _this.mcp2.LOW);
                    _this.Log.WriteLog("Pin " + i + " de MPC2 Detenido", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    _this.Log.WriteLog("Error al detener Pin: " + i + " de MCP2", ci_syslogs_1.Logger.Severities.Error);
                }
            }
            callback = null;
        };
        //Busqueda del elevador
        _this.findElevator = function (callback) {
            _this.stateMachine.findProcess = true;
            var timeUp;
            //Proceso de busqueda de elevador
            if (_this.stateMachine.location == null) {
                _this.Log.WriteLog("Ubicación desconocida - Iniciando búsqueda", ci_syslogs_1.Logger.Severities.Debug);
                async_1.default.series([
                    function (callback) {
                        _this.Log.WriteLog("Step 1 - Subiendo en búsqueda del elevador", ci_syslogs_1.Logger.Severities.Debug);
                        _this.motorStartUp();
                        var count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (_this.stateMachine.location != null) {
                                _this.motorStop();
                                callback(true);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                            if (count > 3500) {
                                _this.motorStop();
                                callback(null);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                        }, 100);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 2 - Bajando en búsqueda del elevador", ci_syslogs_1.Logger.Severities.Debug);
                        _this.motorStartDown();
                        var count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (_this.stateMachine.location != null) {
                                _this.motorStop();
                                callback(true);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                            if (count > 3000) {
                                _this.motorStop();
                                callback(null);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                        }, 100);
                    },
                ], function (error) {
                    if (error == true) {
                        _this.Log.WriteLog("Elevador ubicado en " + _this.stateMachine.location, ci_syslogs_1.Logger.Severities.Error);
                        _this.gotoInitPosition(callback);
                    }
                    else {
                        _this.Log.WriteLog("Elevador no pudo ser encontrado", ci_syslogs_1.Logger.Severities.Alert);
                        _this.stateMachine.blokingType = 1;
                        _this.motorStop();
                        _this.controlBlocking(callback);
                    }
                });
            }
            else {
                _this.Log.WriteLog("Elevador encontrado en el piso: " + _this.stateMachine.location, ci_syslogs_1.Logger.Severities.Debug);
                _this.stateMachine.findProcess = false;
                callback(null);
            }
        };
        //Chequea posición del elevador según parámetro
        _this.checkPosition = function (pos) {
            return _this.stateMachine.location == pos;
        };
        //Enciende el motor del elevador hacia abajo
        _this.motorStartDown = function () {
            try {
                if (_this.checkPosition(7)) {
                    _this.Log.WriteLog("El Elevador está al limite inferior, no puede bajar mas", ci_syslogs_1.Logger.Severities.Debug);
                }
                else {
                    _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                    _this.stateMachine.motorState = 2;
                    _this.Log.WriteLog("Elevador Bajando", ci_syslogs_1.Logger.Severities.Debug);
                    _this.emit("Sensor", { cmd: "Motor Start Down" });
                }
            }
            catch (e) {
                _this.Log.WriteLog("Error al bajar ascensor " + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Enciende el motor del elevador hacia arriba
        _this.motorStartUp = function () {
            try {
                if (_this.checkPosition(ConfigMachine_1.default.row[1].Piso)) {
                    _this.Log.WriteLog("El Elevador está al limite superior, no puede subir mas", ci_syslogs_1.Logger.Severities.Debug);
                }
                else {
                    _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                    _this.stateMachine.motorState = 1;
                    _this.Log.WriteLog("Elevador subiendo", ci_syslogs_1.Logger.Severities.Debug);
                    _this.emit("Sensor", { cmd: "Motor Start Up" });
                }
            }
            catch (e) {
                _this.Log.WriteLog("Error al subir ascensor " + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Detiene el motor del elevador
        _this.motorStop = function () {
            try {
                _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.Down.value, _this.mcp2.LOW);
                _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.UP.value, _this.mcp2.LOW);
                _this.stateMachine.motorState = 0;
                _this.Log.WriteLog("Elevador detenido", ci_syslogs_1.Logger.Severities.Debug);
            }
            catch (e) {
                _this.Log.WriteLog("Error al detener ascensor" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Inicia el motor de una cinta específica
        _this.motorCintaStart = function (row, coll, coll2) {
            try {
                async_1.default.parallel([
                    function () {
                        _this.mcp1.digitalWrite(Number(row), _this.mcp1.HIGH);
                    }, function () {
                        _this.mcp1.digitalWrite(Number(coll), _this.mcp1.HIGH);
                    }, function () {
                        if (coll2 != null) {
                            _this.mcp1.digitalWrite(Number(coll2), _this.mcp1.HIGH);
                        }
                    }
                ]);
                _this.Log.WriteLog("Motor de celda activado", ci_syslogs_1.Logger.Severities.Debug);
            }
            catch (e) {
                _this.Log.WriteLog("Error al activar celda" + e.stack, ci_syslogs_1.Logger.Severities.Error);
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
                _this.Log.WriteLog("Motor de celda detenido", ci_syslogs_1.Logger.Severities.Debug);
            }
            catch (e) {
                _this.Log.WriteLog("Error al activar celda" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Emite alerta de seguridad
        _this.emitSecurityAlert = function (msg) {
            _this.Log.WriteLog("Alerta, de seguridad: " + msg, ci_syslogs_1.Logger.Severities.Alert);
            _this.emit("Event", { cmd: "Alerta" });
        };
        //Controla acciones de según señales de sensores
        _this.controlSensors = function (piso, pin, state) {
            _this.stateMachine.readSensor = true;
            //Se emite la alerta si se activa un sensor cuando esta activa el estado de seguridad
            if (_this.stateMachine.securityMachine == true && pin != ConfigMachine_1.default.elevator.Up.PIN && pin != ConfigMachine_1.default.elevator.Down.PIN) {
                _this.emitSecurityAlert("sensor activado cuando la máquina está inactiva pin: " + pin);
                _this.gotoInitPosition(function (err) {
                    if (err != null) {
                        _this.Log.WriteLog("Puerta asegurada por alerta de seguridad: " + pin, ci_syslogs_1.Logger.Severities.Debug);
                    }
                });
            }
            //Acciones cuando se activa
            _this.Log.WriteLog("Sensor de piso " + piso + " en estado " + state + " PIN: " + pin, ci_syslogs_1.Logger.Severities.Debug);
            //Alertas de seguridad por activaciones de sensor inesperados
            switch (_this.stateMachine.motorState) {
                case 0:
                    //Emite Alerta si se activa un sensor en espera por retiro del producto
                    if (_this.stateMachine.isDelivery == true && piso < ConfigMachine_1.default.row[7].Piso && piso != _this.stateMachine.location) {
                        _this.emitSecurityAlert("sensor activado del piso " + piso + " cuando se espera por retiro del producto");
                        _this.gotoInitPosition(function () {
                            _this.Log.WriteLog("Puerta asegurada por evento inesperado mientras se retiraba el producto", ci_syslogs_1.Logger.Severities.Alert);
                        });
                    }
                    //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                    if (_this.stateMachine.receivingItem == true && _this.stateMachine.location == piso) {
                        _this.emit("Item recibido", _this.stateMachine.location, state);
                    }
                    break;
                case 1:
                    //Detecta la posición del elevador cuando está en proceso de búsueda
                    if (_this.stateMachine.location == null) {
                        _this.Log.WriteLog("El elevador encontrado en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        _this.stateMachine.location = piso;
                    }
                    //Actualiza ubicación del elevador si la posición es la siguiente
                    if (_this.stateMachine.securityMachine == false && _this.stateMachine.location - 1 == piso) {
                        _this.Log.WriteLog("El elevador está en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        _this.stateMachine.location = piso;
                        _this.stateMachine.timeWithoutSensor = 100;
                    }
                    //Activa alerta si se activa un sensor contrario al avance del elevador
                    if (_this.stateMachine.findProcess == false && piso > _this.stateMachine.location) {
                        _this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en subida");
                        _this.stateMachine.blokingType = 4;
                    }
                    if (piso < _this.stateMachine.goingTo) {
                        _this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + _this.stateMachine.goingTo);
                        _this.stateMachine.blokingType = 5;
                    }
                    break;
                case 2:
                    if (_this.stateMachine.location == null) {
                        _this.Log.WriteLog("El elevador encontrado en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        _this.stateMachine.location = piso;
                    }
                    //Actualiza ubicación del elevador si la posición es la siguiente
                    if (_this.stateMachine.securityMachine == false && _this.stateMachine.location + 1 == piso) {
                        _this.Log.WriteLog("El elevador está en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        _this.stateMachine.location = piso;
                        _this.stateMachine.timeWithoutSensor = 100;
                    }
                    //Activa alerta si se activa un sensor contrario al avance del elevador
                    if (_this.stateMachine.findProcess == false && piso < _this.stateMachine.location) {
                        _this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en bajada");
                        _this.stateMachine.blokingType = 4;
                    }
                    if (piso > _this.stateMachine.goingTo) {
                        _this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + _this.stateMachine.goingTo);
                        _this.stateMachine.blokingType = 5;
                    }
                    break;
            }
            //Detecta que el elevador llego a la posición deseada
            if (_this.stateMachine.goingTo == _this.stateMachine.location) {
                //Si se dirige a hacer una entrega, baja un poco más
                if (_this.stateMachine.isDelivery == true && _this.stateMachine.goingTo == 7) {
                    _this.Log.WriteLog("Bajando el elevador para retirar el producto", ci_syslogs_1.Logger.Severities.Debug);
                    setTimeout(function () {
                        _this.motorStop();
                    }, 300);
                }
                else {
                    _this.motorStop();
                }
            }
            //this.emit("Sensor",{cmd:this.stateMachine.location,pin:pin,state:state});
        };
        //Control de mandos de controladora
        _this.manualController = function (pin, state) {
            if (state === false) {
                _this.securityState(false);
                switch (pin) {
                    case ConfigMachine_1.default.elevator.Up.PIN:
                        _this.Log.WriteLog("Elevador subiendo de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                        _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                        _this.stateMachine.motorState = 1;
                        _this.emit("Sensor", { cmd: "machine", data: "Motor Start Up by Control Board" });
                        break;
                    case ConfigMachine_1.default.elevator.Down.PIN:
                        _this.Log.WriteLog("Elevador bajando de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                        _this.mcp2.digitalWrite(ConfigMachine_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                        _this.stateMachine.motorState = 2;
                        _this.emit("Sensor", { cmd: "machine", data: "Motor Start Down by Control Board" });
                        break;
                    case ConfigMachine_1.default.general.Stop.PIN:
                        _this.Log.WriteLog("Pines detenidos por Controladora", ci_syslogs_1.Logger.Severities.Debug);
                        _this.stopAll(null);
                        _this.stateMachine.motorState = 0;
                        break;
                }
            }
            else {
                _this.Log.WriteLog("Elevador se detuvo de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                _this.motorStop();
                _this.emit("Sensor", { cmd: "machine", data: "Motor Stop Up by Control Board" });
                _this.securityState(true);
            }
        };
        //Recibe señal de entrada y determina de donde proviene
        _this.mainSignal = function (pin, state) {
            _this.emit("Sensor", { 'pin': pin, 'state': state });
            switch (pin) {
                case ConfigMachine_1.default.Sensor["1"].PIN:
                    _this.controlSensors(1, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["2"].PIN:
                    _this.controlSensors(2, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["3"].PIN:
                    _this.controlSensors(3, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["4"].PIN:
                    _this.controlSensors(4, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["5"].PIN:
                    _this.controlSensors(5, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["6"].PIN:
                    _this.controlSensors(6, pin, state);
                    break;
                case ConfigMachine_1.default.Sensor["7"].PIN:
                    _this.controlSensors(7, pin, state);
                    break;
                case ConfigMachine_1.default.Pulso.P1.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Pulso.P2.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Pulso.P3.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 3", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 3", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Pulso.P4.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 4", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 4", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Pulso.P5.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 5", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 5", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Pulso.P6.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor vuelta piso 6", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor vuelta piso 6", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Aux.A1.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor Aux A1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor Aux A1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Aux.A2.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso On sensor Aux A2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Off sensor Aux A2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Card.Int.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso Card In On", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Card In Off", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.Card.Out.PIN:
                    if (state === true) {
                        _this.Log.WriteLog("Pulso Card Out On", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        _this.Log.WriteLog("Pulso Card Out Off", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case ConfigMachine_1.default.elevator.Up.PIN:
                    _this.manualController(ConfigMachine_1.default.elevator.Up.PIN, state);
                    break;
                case ConfigMachine_1.default.elevator.Down.PIN:
                    _this.manualController(ConfigMachine_1.default.elevator.Down.PIN, state);
                    break;
                case ConfigMachine_1.default.general.stop.PIN:
                    _this.manualController(ConfigMachine_1.default.general.Stop.PIN, state);
                    if (state === true) {
                        _this.Log.WriteLog("Se detuvieron todas las salidas", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
            }
        };
        //Enviar el elevador a una fila específica con control de atascos
        _this.GoTo = function (callback, row) {
            if (ConfigMachine_1.default.floors[row].Enable == true) {
                _this.securityState(false);
                _this.Log.WriteLog("Elevador se dirige a la posición: " + row, ci_syslogs_1.Logger.Severities.Debug);
                _this.stateMachine.goingTo = row;
                _this.stateMachine.pinGoingTo = ConfigMachine_1.default.row[row].PIN;
                if (_this.stateMachine.location == row) {
                    _this.Log.WriteLog("El elevador esta en posición", ci_syslogs_1.Logger.Severities.Debug);
                    callback(null);
                }
                else {
                    if (_this.stateMachine.location > row) {
                        _this.motorStartUp();
                    }
                    else if (_this.stateMachine.location < row) {
                        _this.motorStartDown();
                    }
                    _this.stateMachine.initPosition = false;
                    //Espera la posición de destino y verifica atascos
                    _this.controlTime(function (err) {
                        if (err != null) {
                            // if(this.stateMachine.blokingType==4){
                            //     callback("Error por alerta de sensor activado")
                            // }
                            _this.controlBlocking(function (err) {
                                if (err == null) {
                                    _this.Log.WriteLog("Elevador ubicado en posicion segura", ci_syslogs_1.Logger.Severities.Debug);
                                }
                            });
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            }
            else {
                callback("El piso de destino no está habilitado para esta maquina");
            }
        };
        //Prepara y ajusta posición del elevador para recibir artículo
        _this.prepareForDispense = function (callback, piso, height) {
            var timeForDown = height * _this.stateMachine.timeSettingAdjust;
            if (_this.checkPosition(piso)) {
                _this.Log.WriteLog("Comenzando proceso de retroceso para ajuste de altura", ci_syslogs_1.Logger.Severities.Debug);
                _this.motorStartDown();
                setTimeout(function () {
                    _this.motorStop();
                    _this.Log.WriteLog("Elevador ubicado y listo para recibir", ci_syslogs_1.Logger.Severities.Debug);
                    _this.stateMachine.receivingItem = true;
                    callback(null);
                }, timeForDown);
            }
            else {
                _this.Log.WriteLog("El elevador no está en posición para recibir", ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Tiempo de espera para que el cliente retire el producto
        _this.waitForRemoveItem = function (callback) {
            if (ConfigMachine_1.default.Is_empty == false) {
                _this.Log.WriteLog("Hay un producto en el elevador para retirar", ci_syslogs_1.Logger.Severities.Debug);
                var wait_1 = setInterval(function () {
                    if (ConfigMachine_1.default.Is_empty == true) {
                        callback(null);
                        clearInterval(wait_1);
                        wait_1 = null;
                    }
                }, 500);
            }
            else {
                _this.Log.WriteLog("No Hay producto en el elevador, se ajustará en 30s", ci_syslogs_1.Logger.Severities.Debug);
                setTimeout(function () {
                    callback(null);
                }, 22000);
            }
        };
        //Proceso completo para dispensar artículo al cliente
        _this.dispenseItem = function (piso, c1, c2, height, callback) {
            _this.stateMachine.isDispense = true;
            _this.Log.WriteLog("Comenzando proceso de dispensar item en el piso " + piso, ci_syslogs_1.Logger.Severities.Debug);
            _this.securityState(false);
            if (_this.stateMachine.enableMachine == true && _this.stateMachine.readyForDispense == true) {
                _this.stateMachine.readyForDispense = false;
                _this.Log.WriteLog("Comenzando proceso de dispensar item", ci_syslogs_1.Logger.Severities.Debug);
                async_1.default.series([
                    function (callback) {
                        _this.Log.WriteLog("Step 1 Verificando posición de elevador", ci_syslogs_1.Logger.Severities.Debug);
                        _this.findElevator(callback);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 2 Ubicando elevador en posición", ci_syslogs_1.Logger.Severities.Debug);
                        _this.GoTo(callback, piso);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 3 Ajustando posición del elevador segun tamaño", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            _this.prepareForDispense(callback, piso, height);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 4 Dispensado artículo desde cinta", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            _this.dispense(piso, c1, c2, callback);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 5 Bajando elevador para realizar entrega", ci_syslogs_1.Logger.Severities.Debug);
                        _this.stateMachine.receivingItem = false;
                        _this.stateMachine.isDelivery = true;
                        setTimeout(function () {
                            _this.GoTo(callback, ConfigMachine_1.default.row[7].Piso);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 6 Esperando evento del retiro del articulo", ci_syslogs_1.Logger.Severities.Debug);
                        _this.emit("Event", { cmd: "Ok_dispensing", data: true });
                        setTimeout(function () {
                            _this.waitForRemoveItem(callback);
                        }, 1000);
                    },
                    function (callback) {
                        _this.Log.WriteLog("Step 7 Esperando para Asegurar puerta", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            _this.gotoInitPosition(callback);
                        }, 8000);
                    }
                ], function (result) {
                    _this.stateMachine.isDispense = false;
                    _this.stateMachine.readyForDispense = true;
                    if (result == null) {
                        _this.stateMachine.blokingType = 0;
                        _this.stateMachine.attempts = 0;
                        _this.Log.WriteLog('Proceso de Venta Completado', ci_syslogs_1.Logger.Severities.Debug);
                        callback(result);
                    }
                    else {
                        _this.Log.WriteLog("Error: " + result, ci_syslogs_1.Logger.Severities.Alert);
                        _this.gotoInitPosition(function (err) {
                            if (err) {
                                _this.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                            }
                        });
                        callback(result);
                    }
                });
            }
            else {
                callback("Máquina deshabilitada por falla o No está lista");
            }
        };
        //Ubicar el elevador en la posición inicial
        _this.gotoInitPosition = function (callback) {
            _this.stateMachine.findProcess = false;
            _this.Log.WriteLog("InitPos - Elevador va a posición inicial", ci_syslogs_1.Logger.Severities.Debug);
            if (_this.stateMachine.initPosition == true) {
                _this.Log.WriteLog("InitPos - El elevador se encuentra en la posición inicial", ci_syslogs_1.Logger.Severities.Debug);
                callback(null);
            }
            else {
                async_1.default.series([
                    //Step 1 - Ubicando elevador en posicion 7
                    function (callback) {
                        _this.Log.WriteLog("InitPos - Ubicando elevador en la parte inferior, piso 7", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            _this.GoTo(callback, 7);
                        }, 500);
                    },
                    //Step 2 - Ajustando altura de Elevador
                    function (callback) {
                        _this.Log.WriteLog("InitPos - Ajustando altura para bloqueo de puerta principal", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            _this.motorStartUp();
                            setTimeout(function () {
                                _this.motorStop();
                                _this.securityState(true);
                                callback(null);
                            }, 400);
                        }, 500);
                    }
                ], function (result) {
                    if (result == null) {
                        _this.Log.WriteLog("InitPos - Elevador ubicado en posición inicial", ci_syslogs_1.Logger.Severities.Debug);
                        _this.securityState(true);
                        _this.stateMachine.blokingType = 0;
                        _this.stateMachine.attempts = 0;
                        _this.stateMachine.initPosition = true;
                        callback(null);
                    }
                    else {
                        _this.Log.WriteLog("Error ubicando en la posición inicial", ci_syslogs_1.Logger.Severities.Alert);
                        _this.disableMachine();
                        callback(result);
                    }
                });
            }
        };
        //Beta de dispensar;
        _this.dispense = function (piso, coll_1, coll_2, callback) {
            var row = ConfigMachine_1.default.row[piso].PIN;
            var c1 = ConfigMachine_1.default.column[coll_1].PIN;
            var c2 = (coll_2 != null) ? ConfigMachine_1.default.column[coll_2].PIN : null;
            if (_this.checkPosition(piso)) {
                _this.Log.WriteLog("Iniciando Dispensado desde piso " + piso + " columna-1: " + c1 + " columna-2 " + c2, ci_syslogs_1.Logger.Severities.Debug);
                _this.motorCintaStart(row, c1, c2);
                _this.stateMachine.receivingItem = true;
                var countTime_1 = 100;
                var wait_2 = setInterval(function () {
                    countTime_1 += 100;
                    //Si se excede del tiempo estimado
                    if (countTime_1 > 10000) {
                        _this.Log.WriteLog("Exceso de tiempo dispensando, countTime: " + countTime_1, ci_syslogs_1.Logger.Severities.Debug);
                        _this.motorCintaStop(row, c1, c2);
                        callback("Tiempo excedido dispensando artículo");
                        clearInterval(wait_2);
                        wait_2 = null;
                    }
                    //Lee el sensor para leer llegada del producto
                    _this.pollSensor(ConfigMachine_1.default.Sensor[piso].PIN, function (err, value) {
                        //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                        if (value == true) {
                            _this.emit("Item recibido", _this.stateMachine.location, value);
                        }
                    });
                }, 200);
                _this.once("Item recibido", function () {
                    _this.motorCintaStop(row, c1, c2);
                    _this.stateMachine.receivingItem = false;
                    callback(null);
                    clearInterval(wait_2);
                    wait_2 = null;
                });
            }
            else {
                _this.Log.WriteLog("El elevador no está en posición para dispensar", ci_syslogs_1.Logger.Severities.Error);
                callback("El elevador no está en posición para dispensar");
            }
        };
        //Controla el tiempo de avance del motor
        _this.controlTime = function (callback) {
            //Espera la posición de destino
            var nPisos;
            var time = 0;
            var ready = false;
            _this.stateMachine.countTime = 100;
            nPisos = (_this.stateMachine.location != null) ? _this.stateMachine.location - _this.stateMachine.goingTo : 4;
            nPisos = (nPisos < 0) ? nPisos * -1 : nPisos;
            time = nPisos * 2700;
            _this.Log.WriteLog("Se movera " + nPisos + " en un tiempo límite para llegar a destino es " + time, ci_syslogs_1.Logger.Severities.Debug);
            _this.stateMachine.blokingType = 0;
            //Espera la posición de destino
            var wait = setInterval(function () {
                _this.stateMachine.countTime += 100;
                //Si llego sin problemas en el tiempo estimado
                ready = _this.checkPosition(_this.stateMachine.goingTo);
                //Lee el estado del sensor del piso destino
                if (_this.stateMachine.goingTo != 0) {
                    _this.pollSensor(ConfigMachine_1.default.Sensor[_this.stateMachine.goingTo].PIN, function (err, value) {
                        ready = value;
                    });
                }
                if (ready == true) {
                    _this.stateMachine.blokingType = 0;
                    _this.stateMachine.attempts = 0;
                    _this.stateMachine.countTime = 0;
                    clearInterval(wait);
                    wait = null;
                    callback(null);
                }
                //Si se excede del tiempo estimado
                if (_this.stateMachine.countTime > time && _this.stateMachine.isDispense == true) {
                    _this.Log.WriteLog("Leyendo posible atasco, countTime: " + _this.stateMachine.countTime, ci_syslogs_1.Logger.Severities.Debug);
                    //Si es subiendo - Bloqueo en proceso de dispensa subiendo y se paso del tiempo de posición
                    _this.stateMachine.blokingType = (_this.stateMachine.motorState == 1) ? 3 : 0;
                    //Si es bajando - Bloqueo en proceso de dispensa bajando y se paso del tiempo de posición
                    _this.stateMachine.blokingType = (_this.stateMachine.motorState == 2) ? 2 : 0;
                    callback("Bloqueo");
                    clearInterval(wait);
                    wait = null;
                }
                //Si está definido un tipo de bloqueo
                if (_this.stateMachine.blokingType != 0) {
                    callback("Bloqueo");
                    clearInterval(wait);
                    wait = null;
                }
            }, 100);
        };
        //Controla intentos de desatascos del elevador
        _this.controlBlocking = function (callback) {
            _this.stateMachine.attempts++;
            _this.Log.WriteLog("Intentos " + _this.stateMachine.attempts, ci_syslogs_1.Logger.Severities.Debug);
            _this.securityState(false);
            if (_this.stateMachine.attempts > 2) {
                _this.Log.WriteLog("Elevador bloqueado luego de 2 intentos - Se requiere revisión", ci_syslogs_1.Logger.Severities.Critical);
                //callback("Elevador bloqueado luego de 2 intentos - Se requiere revisión")
                _this.disableMachine();
            }
            else {
                _this.Log.WriteLog("Comenzando proceso de desbloqueo número: " + _this.stateMachine.attempts, ci_syslogs_1.Logger.Severities.Debug);
                _this.Log.WriteLog("Intento de desbloqueo de tipo: " + _this.stateMachine.blokingType, ci_syslogs_1.Logger.Severities.Alert);
                switch (_this.stateMachine.blokingType) {
                    //Listo - Probar
                    case 1: //Arranca y no detecta sensores y no se encuentra
                        _this.stateMachine.location = null;
                        _this.Log.WriteLog("Step 1 - Reiniciando sensores", ci_syslogs_1.Logger.Severities.Alert);
                        _this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                _this.Log.WriteLog("Step 2 - Buscando elevador", ci_syslogs_1.Logger.Severities.Alert);
                                _this.findElevator(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
                                        _this.disableMachine();
                                    }
                                    else {
                                        callback(null);
                                    }
                                });
                            }
                        });
                        break;
                    //Listo - Probar
                    case 2: //Atasco del elevador luego de recibir artículo
                        _this.motorStop();
                        _this.stateMachine.enableMachine = false;
                        _this.disableMachine();
                        callback("Se detectó un atasco al bajar para entregar - La máquina está deshabilitada por seguridad");
                        break;
                    //Listo - Probado
                    case 3: //Atasco yendo a buscar un artículo, se detiene y resume el proceso
                        _this.motorStop();
                        _this.Log.WriteLog("Step 1 - Bajando para desatascar", ci_syslogs_1.Logger.Severities.Debug);
                        _this.motorStartDown();
                        setTimeout(function () {
                            _this.motorStop();
                            _this.Log.WriteLog("Step 1 - Resumiendo proceso de dispensa", ci_syslogs_1.Logger.Severities.Debug);
                            setTimeout(function () {
                                callback(null);
                            }, 1500);
                        }, 300);
                        break;
                    //Listo - Probado
                    case 4: //Se detecta un evento inesperado en los sensores
                        _this.stateMachine.isDelivery = false;
                        _this.stateMachine.enableMachine = false;
                        _this.motorStop();
                        setTimeout(function () {
                            _this.gotoInitPosition(function (err) {
                                _this.disableMachine();
                                if (err == null) {
                                    _this.Log.WriteLog("Elevador ubicado en posicion inicial por seguridad", ci_syslogs_1.Logger.Severities.Alert);
                                    _this.stateMachine.attempts = 0;
                                    callback(null);
                                }
                                else {
                                    _this.Log.WriteLog("Maquina deshabilitada, no se pudo estabilizar", ci_syslogs_1.Logger.Severities.Alert);
                                }
                            });
                        }, 1000);
                        break;
                    //Listo - Probar
                    case 5: //Si pasó de posición
                        _this.motorStop();
                        _this.Log.WriteLog("Step 1 - Reseteando sensores", ci_syslogs_1.Logger.Severities.Alert);
                        _this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                _this.Log.WriteLog("Step 2 - ubicando elevador en posición inicial", ci_syslogs_1.Logger.Severities.Alert);
                                _this.stateMachine.location = null;
                                _this.findElevator(function (err) {
                                    if (err != null) {
                                        _this.disableMachine();
                                        callback("No se pudo encontrar el elevador");
                                    }
                                    else {
                                        _this.GoTo(function (err) {
                                            callback(err);
                                        }, _this.stateMachine.goingTo);
                                    }
                                });
                            }
                        });
                        break;
                }
            }
        };
        //Leer pin de entrada Gpio
        _this.pollSensor = function (pin, callback) {
            rpi_gpio_1.default.read(pin, function (err, value) {
                if (err) {
                    _this.Log.WriteLog("Error leyendo el pin " + pin, ci_syslogs_1.Logger.Severities.Error);
                    _this.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                    callback(err);
                }
                else {
                    if (value == true) {
                        _this.Log.WriteLog("Leyendo pin " + pin + " en estado " + value, ci_syslogs_1.Logger.Severities.Debug);
                        callback(null, value);
                    }
                }
            });
        };
        //Leer pines de entrada Gpio
        _this.pollAllSensors = function (callback) {
            var _loop_1 = function (i) {
                _this.pollSensor(ConfigMachine_1.default.Sensor[i].PIN, function (err, value) {
                    _this.Log.WriteLog("Check pin de piso " + i + " - valor: " + value, ci_syslogs_1.Logger.Severities.Debug);
                    _this.stateMachine.location = (value == true && _this.stateMachine.findProcess == true) ? i : null;
                    if (err != null) {
                        callback("Error leyendo pin " + ConfigMachine_1.default.Sensor[i].PIN + " del piso " + i);
                    }
                });
            };
            for (var i = 1; i < 8; i++) {
                _loop_1(i);
            }
            callback(null);
        };
        //Habilitar y deshabilitar maquina
        _this.enableMachine = function () {
            _this.stateMachine.enableMachine = true;
            _this.Log.WriteLog("Máquina habilitada", ci_syslogs_1.Logger.Severities.Debug);
            _this.emit("Event", { cmd: "Enable_Machine" });
        };
        _this.disableMachine = function () {
            _this.stateMachine.enableMachine = false;
            _this.Log.WriteLog("Máquina deshabilitada", ci_syslogs_1.Logger.Severities.Debug);
            _this.emit("Event", { cmd: "Disable_Machine" });
        };
        //Test celdas
        _this.testCeldas = function (piso, coll_1, coll_2, callback) {
            var row = ConfigMachine_1.default.row[piso].PIN;
            var c1 = ConfigMachine_1.default.column[coll_1].PIN;
            var c2 = (coll_2 != null) ? ConfigMachine_1.default.column[coll_2].PIN : null;
            _this.Log.WriteLog("Iniciando test de celda", ci_syslogs_1.Logger.Severities.Debug);
            _this.motorCintaStart(row, c1, c2);
            setTimeout(function () {
                _this.motorCintaStop(row, c1, c2);
                console.log("Test de celda finalizado");
                callback(null);
            }, 4000);
        };
        //Test de pines de salida
        _this.testPinOut = function (mcp, pin, callback) {
            _this.Log.WriteLog("Iniciando test de Pin de salida " + pin + " de MCP " + mcp, ci_syslogs_1.Logger.Severities.Debug);
            try {
                switch (mcp) {
                    case 1:
                        _this.Log.WriteLog("Encendiendo pin " + pin + " de MCP1", ci_syslogs_1.Logger.Severities.Debug);
                        _this.mcp1.digitalWrite(pin, _this.mcp1.HIGH);
                        setTimeout(function () {
                            _this.mcp1.digitalWrite(pin, _this.mcp1.LOW);
                            console.log("Test de celda finalizado");
                            callback(null);
                        }, 3000);
                        break;
                    case 2:
                        _this.Log.WriteLog("Encendiendo pin " + pin + " de MCP2", ci_syslogs_1.Logger.Severities.Debug);
                        _this.mcp2.digitalWrite(pin, _this.mcp2.HIGH);
                        setTimeout(function () {
                            _this.mcp2.digitalWrite(pin, _this.mcp2.LOW);
                            console.log("Test de celda finalizado");
                            callback(null);
                        }, 3000);
                        break;
                }
            }
            catch (e) {
                callback(e);
            }
        };
        _this.Log.WriteLog("Control inicializado Version 8 Lite", ci_syslogs_1.Logger.Severities.Debug);
        rpi_gpio_1.default.on('change', _this.mainSignal);
        _this.initOuts();
        _this.initSensors(function (err) {
            if (err) {
                _this.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
            }
        });
        _this.stateMachine.sensorPiso = new Sensor_1.Sensor();
        _this.Log.WriteLog("Chequeando Sensor Serial", ci_syslogs_1.Logger.Severities.Debug);
        _this.stateMachine.enableMachine = true; // Modo prueba
        setTimeout(function () {
            if (_this.stateMachine.sensorPiso.isCheck == true) {
                _this.securityState(false);
                if (_this.stateMachine.location == null) {
                    _this.pollAllSensors(function (err) {
                        if (err == null) {
                            _this.findElevator(function (cb) {
                                if (cb == null) {
                                    _this.Log.WriteLog("Fin de proceso de busqueda de elevador", ci_syslogs_1.Logger.Severities.Debug);
                                    setTimeout(function () {
                                        _this.gotoInitPosition(function (err) {
                                            if (err != null) {
                                                _this.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                                            }
                                            else {
                                                _this.Log.WriteLog("Elevador Listo", ci_syslogs_1.Logger.Severities.Debug);
                                                _this.enableMachine();
                                            }
                                        });
                                    }, 1000);
                                }
                            });
                        }
                        else {
                            _this.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                            _this.stateMachine.enableMachine = false;
                        }
                    });
                }
            }
            else {
                _this.emit("Event", { cmd: "Error_puerto_serial" });
            }
        }, 5000);
        return _this;
    }
    ;
    return ControllerMachine;
}(events_1.EventEmitter));
exports.ControllerMachine = ControllerMachine;
