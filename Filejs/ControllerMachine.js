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
    //Controla el destino del elevador al moverlo
    //private goingTo: number = 0;
    //Controla el estado del motor. motorState: [0 stop, 1 going up, 2 going down]
    //private motorState: number = 0;
    //Indica la posición actual del elevador
    //private location:any = null;
    //Sensor serial de piso
    //private sensorPiso:any;
    //Estado de recepción de articulo en la bandeja
    //private receivingItem: boolean = false;
    //Estado de despacho de item
    //private isDelivery: boolean = false;
    //Estado de despacho de item
    //private isDispense: boolean = false;
    //Estado de la máquina, si esta habilitada y lista
    //private enableMachine: boolean = false;
    //Estado de seguridad de la máquina
    //private securityMachine: boolean = false;
    //Indica si el elevador está en la posición inicial
    //private initPosition: boolean = false;
    //Indica el tipo de bloqueo
    //private blokingType:number= 0;
    //Indica el número de intentos de desbloqueo
    //private attempts:number=0;
    //Controla la lectura de un sensor dentro de un límite de tiempo
    //private readSensor:boolean = false;
    //Indica que la máquina se encuentra en proceso de búsqueda
    //private findProcess:boolean = false
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
            readSensor: false,
            findProcess: false //Indica que la máquina se encuentra en proceso de búsqueda
        };
        //Proceso de dispensa actual
        _this.currentProcess = {
            piso: null,
            c1: null,
            c2: null,
            height: null
        };
        //Habilita o deshabilita seguridad
        _this.securityState = function (state) {
            _this.stateMachine.securityMachine = state;
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
        _this.initSensors = function (callback) {
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
                callback(null);
            }
            catch (e) {
                _this.Log.LogError("Error al iniciar los sensores de entrada");
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
                    callback(null);
                    _this.Log.LogDebug('Sensores reiniciados ' + result);
                }
                else {
                    callback(result);
                    _this.Log.LogAlert("Error: " + result);
                }
            });
        };
        //Deshabilita todos los sensores
        _this.closeSensors = function (callback) {
            try {
                rpi_gpio_1.default.destroy(function (err) {
                    _this.Log.LogDebug("Sensores deshabilidatos");
                    callback(err);
                });
            }
            catch (e) {
                _this.Log.LogError(e.stack + "Error detener sensores  ");
                callback(e);
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
            _this.stateMachine.findProcess = true;
            //Proceso de busqueda de elevador
            if (_this.stateMachine.location == null) {
                _this.once("Sensor", function (piso, state) {
                    if (state == true) {
                        _this.motorStop();
                        _this.Log.LogDebug("Deteccion de elevador en: " + piso);
                        clearImmediate(timeUp_1); //Probar
                        clearTimeout(timeUp_1);
                        timeUp_1 = null;
                        _this.stateMachine.location = piso;
                        callback(null);
                    }
                });
                _this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
                _this.motorStartUp();
                //Mueve el elevador para conseguir ubicación
                var timeUp_1 = setTimeout(function () {
                    _this.motorStop();
                    if (_this.stateMachine.location == null) {
                        _this.motorStartDown();
                        setTimeout(function () {
                            if (_this.stateMachine.location == null) {
                                _this.Log.LogAlert("Elevador no pudo ser encontrado");
                                _this.stateMachine.blokingType = 1;
                                _this.motorStop();
                                _this.controlBlocking(callback);
                            }
                            else {
                                _this.Log.LogDebug("Elevador encontrado bajando en el piso: " + _this.stateMachine.location);
                                _this.gotoInitPosition(callback);
                            }
                            _this.motorStop();
                        }, 2500);
                    }
                    else {
                        _this.gotoInitPosition(callback);
                    }
                }, 2500);
            }
            else {
                _this.Log.LogDebug("Elevador encontrado en el piso: " + _this.stateMachine.location);
                _this.stateMachine.findProcess = false;
                callback(null);
            }
        };
        //Chequea posición del elevador según parámetro
        _this.checkPosition = function (pos) {
            if (_this.stateMachine.location == pos) {
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
                    _this.stateMachine.motorState = 2;
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
                    _this.stateMachine.motorState = 1;
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
                _this.stateMachine.motorState = 0;
                _this.Log.LogDebug("Elevador detenido");
                _this.stateMachine.goingTo = 0;
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
        //Inicia el motor de una cinta específica
        _this.motorCintaStart = function (row, coll, coll2) {
            try {
                async_1.default.parallel([function () {
                        _this.Log.LogDebug("Activando pin fila: " + row);
                        _this.mcp1.digitalWrite(Number(row), _this.mcp1.HIGH);
                    }, function () {
                        _this.Log.LogDebug("Activando pin columna: " + coll);
                        _this.mcp1.digitalWrite(Number(coll), _this.mcp1.HIGH);
                    }, function () {
                        if (coll2 != null) {
                            _this.Log.LogDebug("Activando pin columna: " + coll2);
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
        //Emite alerta de seguridad
        _this.emitSecurityAlert = function (msg) {
            _this.Log.LogAlert("Alerta, de seguridad: " + msg);
            _this.emit("Event", { cmd: "Alerta" });
        };
        //Controla acciones de según señales de sensores
        _this.controlSensors = function (piso, pin, state) {
            _this.stateMachine.readSensor = true;
            //Se emite la alerta si se activa un sensor cuando esta activa el estado de seguridad
            if (_this.stateMachine.securityMachine == true && pin != Maps_1.default.elevator.Up.PIN && pin != Maps_1.default.elevator.Down.PIN) {
                _this.emitSecurityAlert("sensor activado cuando la máquina está inactiva pin: " + pin);
                _this.gotoInitPosition(function (err) {
                    if (err != null) {
                        _this.Log.LogAlert("Puerta asegurada por alerta de seguridad: " + pin);
                    }
                });
            }
            //Acciones cuando se activa o desactiva un sensor
            if (state === true) {
                _this.Log.LogDebug("Sensor de piso " + piso + " On");
                //Alertas de seguridad por activaciones de sensor inesperados
                switch (_this.stateMachine.motorState) {
                    case 0:
                        //Emite Alerta si se activa un sensor en espera por retiro del producto
                        if (_this.stateMachine.isDelivery == true && piso < Maps_1.default.row.M.Piso && piso != _this.stateMachine.location) {
                            _this.emitSecurityAlert("sensor activado del piso " + piso + " cuando se espera por retiro del producto");
                            _this.gotoInitPosition(function () {
                                _this.Log.LogAlert("Puerta asegurada por evento inesperado mientras se retiraba el producto");
                            });
                        }
                        //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                        if (_this.stateMachine.receivingItem == true && _this.stateMachine.location == piso) {
                            _this.emit("Item recibido", _this.stateMachine.location, state);
                        }
                        break;
                    case 1:
                        //Actualiza ubicación del elevador
                        if (_this.stateMachine.securityMachine == false && _this.stateMachine.location > piso) {
                            _this.Log.LogDebug("El elevador está en el piso: " + piso);
                            _this.stateMachine.location = piso;
                        }
                        else {
                            if (_this.stateMachine.findProcess == false) {
                                _this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en subida");
                                _this.stateMachine.blokingType = 4;
                            }
                        }
                        if (piso < _this.stateMachine.goingTo) {
                            _this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + _this.stateMachine.goingTo);
                            _this.stateMachine.blokingType = 4;
                        }
                        break;
                    case 2:
                        //Actualiza ubicación del elevador
                        if (_this.stateMachine.securityMachine == false && _this.stateMachine.location < piso) {
                            _this.Log.LogDebug("El elevador está en el piso: " + piso);
                            _this.stateMachine.location = piso;
                        }
                        else {
                            if (_this.stateMachine.findProcess == false) {
                                _this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en bajada");
                                _this.stateMachine.blokingType = 4;
                            }
                        }
                        if (piso > _this.stateMachine.goingTo) {
                            _this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + _this.stateMachine.goingTo);
                            _this.stateMachine.blokingType = 4;
                        }
                        break;
                }
                //Detecta que el elevador llego a la posición deseada
                if (_this.stateMachine.goingTo == _this.stateMachine.location) {
                    //Si se dirige a hacer una entrega, baja un poco más
                    if (_this.stateMachine.isDelivery == true && _this.stateMachine.goingTo == 7) {
                        _this.Log.LogDebug("Bajando el elevador para retirar el producto");
                        setTimeout(function () {
                            _this.motorStop();
                        }, 300);
                    }
                    else {
                        _this.motorStop();
                    }
                }
            }
            else {
                _this.Log.LogDebug("Sensor de piso " + piso + " Off");
            }
            _this.emit("Sensor", _this.stateMachine.location, state);
        };
        //Control de mandos de controladora
        _this.manualController = function (pin, state) {
            if (state === false) {
                _this.securityState(false);
                switch (pin) {
                    case Maps_1.default.elevator.Up.PIN:
                        _this.Log.LogDebug("Elevador subiendo de forma manual");
                        _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                        _this.stateMachine.motorState = 1;
                        break;
                    case Maps_1.default.elevator.Down.PIN:
                        _this.Log.LogDebug("Elevador bajando de forma manual");
                        _this.mcp2.digitalWrite(Maps_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                        _this.stateMachine.motorState = 2;
                        break;
                }
            }
            else {
                _this.Log.LogDebug("Elevador se detuvo de forma manual");
                _this.motorStop();
                _this.securityState(true);
            }
        };
        //Recibe señal de entrada y determina de donde proviene
        _this.mainSignal = function (pin, state) {
            switch (pin) {
                case Maps_1.default.Sensor.S1.PIN:
                    _this.controlSensors(1, pin, state);
                    break;
                case Maps_1.default.Sensor.S2.PIN:
                    _this.controlSensors(2, pin, state);
                    break;
                case Maps_1.default.Sensor.S3.PIN:
                    _this.controlSensors(3, pin, state);
                    break;
                case Maps_1.default.Sensor.S4.PIN:
                    _this.controlSensors(4, pin, state);
                    break;
                case Maps_1.default.Sensor.S5.PIN:
                    _this.controlSensors(5, pin, state);
                    break;
                case Maps_1.default.Sensor.S6.PIN:
                    _this.controlSensors(6, pin, state);
                    break;
                case Maps_1.default.Sensor.SM.PIN:
                    _this.controlSensors(7, pin, state);
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
                    _this.manualController(Maps_1.default.elevator.Up.PIN, state);
                    break;
                case Maps_1.default.elevator.Down.PIN:
                    _this.manualController(Maps_1.default.elevator.Down.PIN, state);
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
        //Enviar el elevador a una fila específica con control de atascos
        _this.GoTo = function (callback, row) {
            _this.securityState(false);
            _this.Log.LogDebug("Elevador se dirige a la posición: " + row);
            _this.stateMachine.goingTo = row;
            if (_this.stateMachine.location == row) {
                _this.Log.LogDebug("El elevador esta en posición");
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
                _this.controlTime(callback);
            }
        };
        //Prepara y ajusta posición del elevador para recibir artículo
        _this.prepareForDispense = function (callback, height) {
            var timeForDown = height * 13;
            if (_this.checkPosition(_this.stateMachine.location)) {
                _this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
                _this.motorStartDown();
                setTimeout(function () {
                    _this.motorStop();
                    _this.Log.LogDebug("Elevador ubicado y listo para recibir");
                    _this.stateMachine.receivingItem = true;
                    callback(null);
                }, timeForDown);
            }
            else {
                _this.Log.LogError("El elevador no está en posición para recibir");
            }
        };
        //Tiempo de espera para que el cliente retire el producto
        _this.waitForRemoveItem = function (callback) {
            if (Global_1.default.Is_empty == false) {
                _this.Log.LogDebug("Hay un producto en el elevador para retirar");
                var wait_1 = setInterval(function () {
                    if (Global_1.default.Is_empty == true) {
                        callback(null);
                        clearInterval(wait_1);
                        wait_1 = null;
                    }
                }, 500);
            }
            else {
                _this.Log.LogDebug("No Hay producto en el elevador, se ajustará en 30s");
                setTimeout(function () {
                    callback(null);
                }, 22000);
            }
        };
        //Proceso completo para dispensar artículo al cliente
        _this.dispenseItem = function (piso, c1, c2, height, callback) {
            _this.stateMachine.isDispense = true;
            _this.Log.LogDebug("Comenzando proceso de dispensar item en el piso " + piso);
            //Almacenando datos del proceso actual
            _this.currentProcess.piso = piso;
            _this.currentProcess.c1 = c1;
            _this.currentProcess.c2 = c2;
            _this.currentProcess.height = height;
            _this.securityState(false);
            if (_this.stateMachine.enableMachine) {
                _this.Log.LogDebug("Comenzando proceso de dispensar item");
                async_1.default.series([
                    function (callback) {
                        _this.Log.LogDebug("Step 0 Reiniciando sensores");
                        _this.resetSensors(callback);
                    },
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
                        _this.stateMachine.receivingItem = false;
                        _this.stateMachine.isDelivery = true;
                        _this.GoTo(callback, 7);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 6 Esperando evento del retiro del articulo");
                        _this.emit("Event", { cmd: "Ok_dispensing", data: true });
                        setTimeout(function () {
                            _this.waitForRemoveItem(callback);
                        }, 2000);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 7 Asegurando puerta");
                        setTimeout(function () {
                            _this.gotoInitPosition(callback);
                        }, 8000);
                    }
                ], function (result) {
                    _this.stateMachine.isDispense = false;
                    if (result == null) {
                        _this.stateMachine.blokingType = 0;
                        _this.stateMachine.attempts = 0;
                        _this.Log.LogDebug('Proceso de venta completo ' + result);
                        _this.currentProcess.piso = null;
                        _this.currentProcess.c1 = null;
                        _this.currentProcess.c2 = null;
                        _this.currentProcess.height = null;
                        callback(result);
                    }
                    else {
                        _this.Log.LogAlert("Error: " + result);
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
            _this.stateMachine.findProcess = false;
            _this.Log.LogDebug("InitPos - Elevador va a posición inicial");
            if (_this.stateMachine.initPosition == true) {
                _this.Log.LogDebug("InitPos - El elevador se encuentra en la posición inicial");
                callback(null);
            }
            else {
                async_1.default.series([
                    //Step 1 - Ubicando elevador en posicion 7
                    function (callback) {
                        _this.Log.LogDebug("InitPos - Ubicando elevador en la parte inferior, piso 7");
                        setTimeout(function () {
                            _this.GoTo(callback, 7);
                        }, 500);
                    },
                    //Step 2 - Ajustando altura de Elevador
                    function (callback) {
                        _this.Log.LogDebug("InitPos - Ajustando altura para bloqueo de puerta principal");
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
                        _this.Log.LogDebug("InitPos - Elevador ubicado en posición inicial");
                        _this.securityState(true);
                        _this.stateMachine.blokingType = 0;
                        _this.stateMachine.attempts = 0;
                        _this.stateMachine.initPosition = true;
                        callback(null);
                    }
                    else {
                        _this.Log.LogAlert("Error ubicando en la posición inicial");
                        callback(result);
                    }
                });
            }
        };
        //Beta de dispensar
        _this.dispense = function (piso, coll_1, coll_2, callback) {
            _this.findRow(piso, coll_1, coll_2, function (err, row, c1, c2) {
                _this.Log.LogDebug("Dispensando desde piso " + piso + " columna 1: " + c1 + " columna 2 " + c2);
                _this.Log.LogDebug("Dispensado artículo desde cinta");
                _this.motorCintaStart(row, c1, c2);
                _this.stateMachine.receivingItem = true;
                _this.once("Item recibido", function () {
                    _this.motorCintaStop(row, coll_1, coll_2);
                    _this.stateMachine.receivingItem = false;
                    callback(null);
                });
            });
        };
        //Controla el tiempo de avance del motor
        _this.controlTime = function (callback) {
            //Espera la posición de destino
            var nPisos = 0;
            _this.stateMachine.readSensor = false;
            if (_this.stateMachine.location != null) {
                nPisos = _this.stateMachine.location - _this.stateMachine.goingTo;
            }
            else {
                nPisos = 4;
            }
            var time = 0;
            var countTime = 100;
            if (nPisos < 0) {
                nPisos = nPisos * -1;
            }
            time = nPisos * 1900;
            _this.Log.LogDebug("Se movera " + nPisos + " en un tiempo límite para llegar a destino es " + time);
            //Espera la posición de destino
            var wait = setInterval(function () {
                countTime = countTime + 100;
                //Si han pasado 4 segundos sin detectar ningun sensor
                if (countTime > 4000 && _this.stateMachine.readSensor == false) {
                    _this.stateMachine.blokingType = 5;
                    _this.controlBlocking(callback);
                    clearInterval(wait);
                    wait = null;
                }
                //Si la esta definido un tipo de bloqueo
                if (_this.stateMachine.blokingType != 0) {
                    _this.controlBlocking(callback);
                    clearInterval(wait);
                    wait = null;
                }
                //Si llego sin problemas en el tiempo estimado
                if (_this.checkPosition(_this.stateMachine.goingTo)) {
                    _this.Log.LogDebug("Elevador llego en: " + countTime + " ms");
                    _this.stateMachine.blokingType = 0;
                    _this.stateMachine.attempts = 0;
                    clearInterval(wait);
                    wait = null;
                    callback(null);
                }
                //Si se excede del tiempo estimado
                if (countTime > time) {
                    _this.Log.LogDebug("Leyendo posible atasco, countTime: " + countTime);
                    //Si es subiendo - Bloqueo en proceso de dispensa subiendo y se paso del tiempo de posición
                    if (_this.stateMachine.motorState == 1 && _this.stateMachine.isDispense == true) {
                        _this.stateMachine.blokingType = 3;
                    }
                    //Si es bajando - Bloqueo en proceso de dispensa bajando y se paso del tiempo de posición
                    if (_this.stateMachine.motorState == 2 && _this.stateMachine.isDispense == true) {
                        _this.stateMachine.blokingType = 2;
                    }
                    _this.controlBlocking(callback);
                    clearInterval(wait);
                    wait = null;
                }
            }, 100);
        };
        //Controla intentos de desatascos del elevador
        _this.controlBlocking = function (callback) {
            _this.stateMachine.attempts++;
            _this.securityState(false);
            if (_this.stateMachine.attempts > 2) {
                _this.Log.LogCritical("Elevador bloqeuado luego de 2 intentos - Se requiere revisión");
                callback("Elevador bloqueado luego de 2 intentos - Se requiere revisión");
            }
            else {
                _this.Log.LogDebug("Comenzando proceso de desbloqueo número: " + _this.stateMachine.attempts);
                switch (_this.stateMachine.blokingType) {
                    //Listo - Probar
                    case 1: //Arranca y no detecta sensores y no se encuentra
                        _this.Log.LogAlert("Intento de desbloqueo de tipo 1 :" + _this.stateMachine.blokingType);
                        _this.stateMachine.location = null;
                        _this.Log.LogAlert("Step 1 - Reiniciando sensores");
                        _this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                _this.Log.LogAlert("Step 2 - Buscando elevador");
                                _this.findElevator(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
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
                        _this.Log.LogAlert("Intento de desatasco de tipo 2: " + _this.stateMachine.blokingType);
                        _this.motorStop();
                        _this.stateMachine.enableMachine = false;
                        callback("Se detectó un atasco al bajar para entregar - La máquina está deshabilitada por seguridad");
                        break;
                    //Listo - Probado
                    case 3: //Atasco yendo a buscar un artículo, se detiene y resume el proceso
                        _this.Log.LogAlert("Intento de desatasco de tipo 3 :" + _this.stateMachine.blokingType);
                        _this.motorStop();
                        _this.Log.LogDebug("Step 1 - Bajando para desatascar");
                        _this.motorStartDown();
                        setTimeout(function () {
                            _this.motorStop();
                            _this.Log.LogDebug("Step 1 - Resumiendo proceso de dispensa");
                            setTimeout(function () {
                                callback(null);
                            }, 1500);
                        }, 300);
                        break;
                    //Listo - Probar
                    case 4: //Se detecta un evento inesperado en los sensores
                        _this.Log.LogAlert("Intento de desatasco de tipo 4 :" + _this.stateMachine.blokingType);
                        _this.stateMachine.isDelivery = false;
                        _this.motorStop();
                        setTimeout(function () {
                            _this.gotoInitPosition(function (err) {
                                if (err) {
                                    _this.Log.LogAlert("Maquina deshabilitada, no se pudo estabilizar");
                                    _this.stateMachine.enableMachine = false;
                                }
                                else {
                                    _this.Log.LogAlert("Elevador ubicado en posicion inicial por seguridad");
                                    _this.stateMachine.attempts = 0;
                                    _this.stateMachine.blokingType = 0;
                                }
                            });
                        }, 1000);
                        callback("Se detectó un evento inesperado - La máquina está deshabilitada por seguridad");
                        break;
                    //Listo - Probar
                    case 5: //Si han pasado 4 segundos sin detectar ningun sensor cuando el motor está en movimiento
                        _this.Log.LogAlert("Intento de desatasco de tipo 5 :" + _this.stateMachine.blokingType);
                        _this.motorStop();
                        _this.Log.LogAlert("Step 1 - Reseteando sensores");
                        _this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                _this.Log.LogAlert("Step 2 - Buscando elevador");
                                _this.findElevator(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
                                    }
                                    else {
                                        callback(null);
                                    }
                                });
                            }
                        });
                        break;
                    //Listo - Probar
                    case 6: //Si pasó de posición
                        _this.Log.LogAlert("Intento de desatasco de tipo 6 :" + _this.stateMachine.blokingType);
                        _this.motorStop();
                        _this.Log.LogAlert("Step 1 - Reseteando sensores");
                        _this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                _this.Log.LogAlert("Step 2 - ubicando elevador en posición inicial");
                                _this.gotoInitPosition(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
                                    }
                                    else {
                                        callback(null);
                                    }
                                });
                            }
                        });
                        break;
                }
            }
        };
        //**************************Beta*******************************!//
        //Test celdas
        _this.testCeldas = function (piso, coll_1, coll_2, callback) {
            _this.findRow(piso, coll_1, coll_2, function (err, row, c1, c2) {
                _this.Log.LogDebug("Iniciando test de celda");
                _this.motorCintaStart(row, c1, c2);
                setTimeout(function () {
                    _this.motorCintaStop(row, c1, c2);
                    console.log("Test de celda finalizado");
                    callback(null);
                }, 4000);
            });
        };
        //Busqueda del elevador
        _this.findElevatorBeta = function (callback) {
            _this.stateMachine.findProcess = true;
            var timeUp;
            //Proceso de busqueda de elevador
            if (_this.stateMachine.location == null) {
                _this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
                async_1.default.series([
                    function (callback) {
                        _this.Log.LogDebug("Step 1 - Subiendo en búsqueda del elevador");
                        _this.motorStartUp();
                        var count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (_this.stateMachine.location != null) {
                                _this.motorStop();
                                callback(true); //Pendiente con esto
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                            if (count > 3500) {
                                _this.motorStop();
                                callback(null); //Pendiente con esto
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                        }, 100);
                    },
                    function (callback) {
                        _this.Log.LogDebug("Step 2 - Bajando en búsqueda del elevador");
                        _this.motorStartDown();
                        var count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (_this.stateMachine.location != null) {
                                _this.motorStop();
                                callback(true); //Pendiente con esto
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
                        _this.Log.LogError("Elevador ubicado en " + _this.stateMachine.location);
                        _this.gotoInitPosition(callback);
                    }
                    else {
                        _this.Log.LogAlert("Elevador no pudo ser encontrado");
                        _this.stateMachine.blokingType = 1;
                        _this.motorStop();
                        _this.controlBlocking(callback);
                    }
                });
            }
            else {
                _this.Log.LogDebug("Elevador encontrado en el piso: " + _this.stateMachine.location);
                _this.stateMachine.findProcess = false;
                callback(null);
            }
        };
        _this.Log.LogDebug("Control inicializado");
        rpi_gpio_1.default.on('change', _this.mainSignal);
        _this.initOuts();
        _this.initSensors(function (err) {
            if (err) {
                _this.Log.LogError(err);
            }
        });
        _this.stateMachine.sensorPiso = new Sensor_1.Sensor();
        _this.Log.LogDebug("chequeando serial");
        _this.stateMachine.enableMachine = true; // Modo prueba
        setTimeout(function () {
            if (_this.stateMachine.sensorPiso.isCheck == true) {
                _this.Log.LogDebug("Máquina habilitada");
                _this.stateMachine.enableMachine = true;
                _this.securityState(false);
                _this.emit("Event", { cmd: "Maquina_Lista" });
                if (_this.stateMachine.location == null) {
                    _this.findElevator(function (cb) {
                        _this.Log.LogDebug("Fin de proceso de busqueda de elevador");
                        setTimeout(function () {
                            _this.gotoInitPosition(function (err) {
                                if (err != null) {
                                    _this.Log.LogDebug(err);
                                }
                            });
                        }, 1000);
                    });
                }
            }
            else {
                //this.emit("Event",{cmd:"Error_puerto_serial"})
            }
        }, 5000);
        return _this;
    }
    return ControllerMachine;
}(events_1.default));
exports.ControllerMachine = ControllerMachine;
