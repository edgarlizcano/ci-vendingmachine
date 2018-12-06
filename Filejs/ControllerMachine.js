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
var ci_logmodule_1 = __importDefault(require("@ci24/ci-logmodule"));
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
        _this.motorState = 0;
        //motorState 0 stop
        //motorState 1 up
        //motorState 2 down
        _this.dispense = false;
        _this.checkPosition = function (pos) {
            if (Global_1.default.machinelocation == pos) {
                return true;
            }
            else {
                return false;
            }
        };
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
        _this.initSensors = function () {
            try {
                _this.Log.LogDebug("Inicializando sensores");
                //----------Sensores-------------------//
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S3.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S4.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S5.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.S6.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Sensor.SM.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                //Gpio.setup(global.Sensor.SM.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH, this.initial_elevator);
                // Gpio.setup(global.Pulso.P1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP1);
                // Gpio.setup(global.Pulso.P2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP2);
                // Gpio.setup(global.Pulso.P3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP3);
                // Gpio.setup(global.Pulso.P4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP4);
                // Gpio.setup(global.Pulso.P5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP5);
                // Gpio.setup(global.Pulso.P6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP6);
                rpi_gpio_1.default.setup(Global_1.default.Aux.A1.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Aux.A2.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Card.Int.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.Card.Out.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.elevator.Up.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.elevator.Down.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                rpi_gpio_1.default.setup(Global_1.default.general.stop.PIN, rpi_gpio_1.default.DIR_IN, rpi_gpio_1.default.EDGE_BOTH);
                _this.Log.LogDebug("Sensores listos");
            }
            catch (e) {
                _this.Log.LogError("Error al iniciar los sensores");
                _this.Log.LogError(e.stack + JSON.stringify(Global_1.default.result.ERROR_INIT_GPIO));
            }
        };
        _this.closeSensors = function (cb) {
            try {
                rpi_gpio_1.default.destroy(function (err) {
                    _this.Log.LogDebug("Sensores deshabilidatos");
                    ci_logmodule_1.default.write('Desabilitados tods los sensores' + err);
                    cb(err);
                });
            }
            catch (e) {
                ci_logmodule_1.default.error(e.stack + "Error detener sensores  ");
                cb(e);
            }
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
        _this.motorStartDown = function () {
            try {
                if (_this.checkPosition(7)) {
                    _this.Log.LogDebug("El Elevador está en la PO, no puede bajar mas");
                }
                else {
                    _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.Down.value, _this.mcp2.HIGH);
                    _this.motorState = 2;
                    _this.Log.LogDebug("Elevador Bajando");
                }
            }
            catch (e) {
                _this.Log.LogError("Error al bajar ascensor" + e.stack);
            }
        };
        _this.motorStartUp = function () {
            try {
                if (_this.checkPosition(1)) {
                    _this.Log.LogDebug("El Elevador está en la P6, no puede subir mas");
                }
                else {
                    _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.UP.value, _this.mcp2.HIGH);
                    _this.motorState = 1;
                    _this.Log.LogDebug("Elevador subiendo");
                }
            }
            catch (e) {
                _this.Log.LogError("Error al subir ascensor" + e.stack);
            }
        };
        _this.motorStop = function () {
            try {
                _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.Down.value, _this.mcp2.LOW);
                _this.mcp2.digitalWrite(Global_1.default.MCP_Motor.UP.value, _this.mcp2.LOW);
                _this.motorState = 0;
                _this.Log.LogDebug("Elevador detenido");
            }
            catch (e) {
                _this.Log.LogError("Error al detener ascensor" + e.stack);
            }
        };
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
        _this.signal = function (pin, state) {
            if (state === true) {
                switch (pin) {
                    case Global_1.default.Sensor.S1.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S1 On");
                            Global_1.default.machinelocation = 1;
                            if (_this.goingTo == Global_1.default.machinelocation || _this.motorState == 1) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S1 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.S2.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S2 On");
                            Global_1.default.machinelocation = 2;
                            if (_this.goingTo == Global_1.default.machinelocation || _this.motorState == 1) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S2 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.S3.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S3 On");
                            Global_1.default.machinelocation = 3;
                            if (_this.goingTo == Global_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S3 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.S4.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S4 On");
                            Global_1.default.machinelocation = 4;
                            if (_this.goingTo == Global_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S4 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.S5.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S5 On");
                            Global_1.default.machinelocation = 5;
                            if (_this.goingTo == Global_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S5 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.S6.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor S6 On");
                            Global_1.default.machinelocation = 6;
                            if (_this.goingTo == Global_1.default.machinelocation) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor S6 Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
                        break;
                    case Global_1.default.Sensor.SM.PIN:
                        if (state === true) {
                            _this.Log.LogDebug("Sensor SM On");
                            Global_1.default.machinelocation = 7;
                            if (_this.goingTo == Global_1.default.machinelocation || _this.motorState == 2) {
                                _this.motorStop();
                            }
                        }
                        else {
                            _this.Log.LogDebug("Sensor SM Off");
                        }
                        _this.emit("Sensor", Global_1.default.machinelocation, state);
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
        _this.GoTo = function (row) {
            _this.goingTo = row;
            if (Global_1.default.machinelocation == row) {
                _this.Log.LogDebug("El elevador esta en posición");
            }
            else {
                if (Global_1.default.machinelocation > row) {
                    _this.motorStartUp();
                }
                else if (Global_1.default.machinelocation < row) {
                    _this.motorStartDown();
                }
            }
        };
        _this.waitPosition = function (piso) {
            _this.Log.LogDebug("Esperando posición de elevador");
            setInterval(function () {
                if (Global_1.default.machinelocation == piso) {
                    clearInterval();
                    _this.Log.LogDebug("Elevador llego a la posición");
                }
            }, 100);
        };
        _this.prepareForDispense = function (height) {
            var timeForDown = height * 17;
            if (_this.checkPosition(Global_1.default.machinelocation)) {
                _this.Log.LogDebug("Comenzando proceso de retroceso");
                _this.motorStartDown();
                setTimeout(function () {
                    _this.motorStop();
                }, timeForDown);
                _this.Log.LogDebug("Elevador preparado para recibir");
            }
            else {
                _this.Log.LogError("El elevador no está en posición para dispensar");
            }
        };
        _this.prepareForDeliver = function (row, coll) {
            setInterval(function () {
                _this.on("Sensor", function () {
                    _this.motorCintaStop(row, coll);
                    clearInterval();
                    _this.Log.LogDebug("Articulo recibido, comenzando la entrega");
                });
            });
        };
        /*public dispenseItem=(piso: number ,row: number, coll:number, height: number)=>{
            this.Log.LogDebug("Comenzando proceso de dispensar item");
            _async.series([
                // Step 1 - Ir a ubicación
                _async.apply(this.GoTo,piso),
                // Step 2
                _async.apply(this.waitPosition, piso),
                // Step 3
                _async.apply(this.prepareForDispense, height),
                // Step 4
                //_async.apply(this.motorCintaStart,row,coll),
                // Step 5
                //_async.apply(this.prepareForDeliver, row, coll),
                // Step 6
                //Modificar este paso para validar la entrega del producto
                //_async.apply(this.GoTo,7)
            ])
        }*/
        _this.dispenseItem = function (piso, row, coll, height) {
            _this.Log.LogDebug("Comenzando proceso de dispensar item");
            _this.GoTo(piso);
            _this.waitPosition(piso);
            _this.prepareForDispense(height);
            _this.motorCintaStart(row, coll);
            _this.prepareForDeliver(row, coll);
            _this.GoTo(7);
        };
        _this.Log.LogDebug("Control inicializado");
        rpi_gpio_1.default.on('change', _this.signal);
        _this.initOuts();
        _this.initSensors();
        return _this;
        /*Gpio.read(global.Sensor.SM.PIN,(err:any, value?:any)=> {
            if (err != null) {
                if(value==true){
                    this.Log.LogDebug("Sensor On "+"SM");
                }else{
                    this.motorStartDown();
                }
            }else{
                this.Log.LogDebug("Error al leer posicion inicial");
                this.Log.LogDebug(JSON.stringify(global.result.ERROR_READ_PIN_SM));
            }
        });*/
    }
    return ControllerMachine;
}(events_1.default));
exports.ControllerMachine = ControllerMachine;
