"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let node_mcp23017_with_i2c_updated_1 = require("node-mcp23017_with_i2c_updated");
let events_1 = require("events");
let rpi_gpio_1 = require("rpi-gpio");
let async_1 = require("async");
let ci_syslogs_1 = require("ci-syslogs");
let Sensor_1 = require("./Sensor");
let Config = require("./ConfigMachine");

module.exports= class ControllerMachine extends events_1.EventEmitter{
    constructor(args){
        super();
        let that=this;
        that.Log = new ci_syslogs_1.Logger("0.0.0.0", ci_syslogs_1.Logger.Facilities.Machine);
        that.mcp1 = new node_mcp23017_with_i2c_updated_1({
            address: 0x20,
            device: '/dev/i2c-1',
            debug: true
        });
        that.mcp2 = new node_mcp23017_with_i2c_updated_1({
            address: 0x21,
            device: '/dev/i2c-1',
            debug: true
        });
        //Variables de control de la máquina
        that.stateMachine = {
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
            findProcess: false,
            pollProcess: false,
            readyForDispense: true,
            timeSettingAdjust: 16,
            countTime: 100,
            timeToDisepense: 100,
            timeWithoutSensor: 100
        };

        that.Log.WriteLog("Control inicializado Version 8", ci_syslogs_1.Logger.Severities.Debug);
        rpi_gpio_1.on('change', mainSignal);
        initOuts();
        initSensors(function (err) {
            if (err!=null) {
                that.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
            }
        });
        that.stateMachine.sensorPiso = new Sensor_1.Sensor();
        that.Log.WriteLog("Chequeando Sensor Serial", ci_syslogs_1.Logger.Severities.Debug);
        //that.stateMachine.enableMachine=true;// Modo prueba
        setTimeout(function () {
            //if (that.stateMachine.sensorPiso.isCheck === true) {
                that.Log.WriteLog("Máquina habilitada", ci_syslogs_1.Logger.Severities.Debug);
                that.stateMachine.enableMachine = true;
                securityState(false);
                that.emit("Event", { cmd: "Maquina_Lista" });
                if (that.stateMachine.location == null) {
                    findElevator(function (cb) {
                        if (cb == null) {
                            that.Log.WriteLog("Fin de proceso de busqueda de elevador", ci_syslogs_1.Logger.Severities.Debug);
                            setTimeout(function () {
                                gotoInitPosition(null, function (err) {
                                    if (err != null) {
                                        that.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                                    }
                                    else {
                                        enableMachine();
                                    }
                                });
                            }, 1000);
                        }
                        else {
                            that.Log.WriteLog("Elevador No pudo ser encontrado", ci_syslogs_1.Logger.Severities.Debug);
                            disableMachine();
                        }
                    });
                }
            //}
            // else {
            //     that.emit("Event", { cmd: "Error_puerto_serial" });
            // }
        }, 6000);

        //Habilitar y deshabilitar maquina
        function enableMachine() {
            that.stateMachine.enableMachine = true;
            that.Log.WriteLog("Máquina habilitada", ci_syslogs_1.Logger.Severities.Debug);
            //that.emit("Event", { cmd: "Enable_Machine" });
            that.emit("Event", { cmd: "Maquina_Lista" });

        }
        function disableMachine() {
            that.stateMachine.enableMachine = false;
            that.Log.WriteLog("Máquina deshabilitada", ci_syslogs_1.Logger.Severities.Debug);
            that.emit("Event", { cmd: "Disable_Machine" });
        }
        //Habilita o deshabilita seguridad
        function securityState(state) {
            that.stateMachine.securityMachine = state;
            that.Log.WriteLog("La seguridad está en: " + that.stateMachine.securityMachine, ci_syslogs_1.Logger.Severities.Debug);
        }
        //Inicializa salidas
        function initOuts() {
            that.Log.WriteLog("Inicializando salidas", ci_syslogs_1.Logger.Severities.Debug);
            for (let i = 0; i < 16; i++) {
                try {
                    that.mcp1.pinMode(i, that.mcp1.OUTPUT);
                    that.Log.WriteLog("Pin " + i + " de MPC1 Inicializado", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    that.Log.WriteLog("Error al inicializar Pin: " + i + " de MCP1", ci_syslogs_1.Logger.Severities.Error);
                }
                try {
                    that.mcp2.pinMode(i, that.mcp2.OUTPUT);
                    that.Log.WriteLog("Pin " + i + " de MPC2 Inicializado", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    that.Log.WriteLog("Error al inicializar Pin: " + i + " de MCP2", ci_syslogs_1.Logger.Severities.Error);
                }
            }
            that.Log.WriteLog("Inicialización exitosa", ci_syslogs_1.Logger.Severities.Debug);
        }
        //Inicializa sensores
        function initSensors (callback) {
            try {
                that.Log.WriteLog("Inicializando Sensores", ci_syslogs_1.Logger.Severities.Debug);
                rpi_gpio_1.setup(Config.Sensor[1].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[2].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[3].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[4].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[5].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[6].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.Sensor[7].PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_RISING);
                rpi_gpio_1.setup(Config.elevator.Up.PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_BOTH);
                rpi_gpio_1.setup(Config.elevator.Down.PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_BOTH);
                //rpi_gpio_1.setup(Config.general.stop.PIN, rpi_gpio_1.DIR_IN, rpi_gpio_1.EDGE_BOTH);
                //Gpio.setup(Maps.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Maps.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Maps.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                //Gpio.setup(Maps.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
                that.Log.WriteLog("Sensores Listos", ci_syslogs_1.Logger.Severities.Debug);
                callback(null);
            }
            catch (e) {
                that.Log.WriteLog("Error al iniciar los sensores de entrada", ci_syslogs_1.Logger.Severities.Error);
                callback("Error al iniciar los sensores de entrada. " + e.stackTrace);
            }
        }
        //Resetear sensores
        function resetSensors(callback) {
            async_1.series([
                function (callback) {
                    closeSensors(callback);
                },
                function (callback) {
                    initSensors(callback);
                }
            ], function (result) {
                if (result == null) {
                    callback(result);
                    that.Log.WriteLog('Sensores Reiniciados ' + result, ci_syslogs_1.Logger.Severities.Debug);
                }
                else {
                    callback(result);
                    that.Log.WriteLog("Error: " + result, ci_syslogs_1.Logger.Severities.Error);
                }
            });
        }
        //Deshabilita todos los sensores
        function closeSensors(callback) {
            try {
                rpi_gpio_1.destroy(function (err) {
                    if (err == null) {
                        that.Log.WriteLog("Sensores deshabilidatos", ci_syslogs_1.Logger.Severities.Debug);
                        callback(null);
                    }
                });
            }
            catch (e) {
                that.Log.WriteLog(e.stack + "Error detener sensores ", ci_syslogs_1.Logger.Severities.Error);
                callback(e);
            }
        }
        //Detiene todos los pines de salida
        function stopAll(data, callback) {
            that.Log.WriteLog("Deteniendo salidas", ci_syslogs_1.Logger.Severities.Debug);
            for (let i = 0; i < 16; i++) {
                try {
                    that.mcp1.digitalWrite(i, that.mcp1.LOW);
                    that.Log.WriteLog("Pin " + i + " de MPC1 Detenido", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    that.Log.WriteLog("Error al detener Pin: " + i + " de MCP1", ci_syslogs_1.Logger.Severities.Error);
                }
                try {
                    that.mcp2.digitalWrite(i, that.mcp2.LOW);
                    that.Log.WriteLog("Pin " + i + " de MPC2 Detenido", ci_syslogs_1.Logger.Severities.Debug);
                }
                catch (e) {
                    that.Log.WriteLog("Error al detener Pin: " + i + " de MCP2", ci_syslogs_1.Logger.Severities.Error);
                }
            }
            callback = null;
        }
        //Busqueda del elevador
        function findElevator(callback) {
            that.stateMachine.findProcess = true;
            let timeUp;
            //Proceso de busqueda de elevador
            if (that.stateMachine.location == null) {
                that.Log.WriteLog("Ubicación desconocida - Iniciando búsqueda", ci_syslogs_1.Logger.Severities.Debug);
                async_1.series([
                    function (callback) {
                        that.Log.WriteLog("Step 1 - Subiendo en búsqueda del elevador", ci_syslogs_1.Logger.Severities.Debug);
                        that.motorStartUp(null,()=>{});
                        let count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (that.stateMachine.location != null) {
                                that.motorStop(null,()=>{});
                                callback(true);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                            if (count > 3500) {
                                that.motorStop(null,()=>{});
                                callback(null);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                        }, 100);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 2 - Bajando en búsqueda del elevador", ci_syslogs_1.Logger.Severities.Debug);
                        that.motorStartDown(null,()=>{});
                        let count;
                        timeUp = setInterval(function () {
                            count = count + 100;
                            if (that.stateMachine.location != null) {
                                that.motorStop(null,()=>{});
                                callback(true);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                            if (count > 3000) {
                                that.motorStop(null,()=>{});
                                callback(null);
                                clearInterval(timeUp);
                                timeUp = null;
                            }
                        }, 100);
                    },
                ], function (error) {
                    if (error === true) {
                        that.Log.WriteLog("Elevador ubicado en " + that.stateMachine.location, ci_syslogs_1.Logger.Severities.Error);
                        gotoInitPosition(null, callback);
                    }
                    else {
                        that.Log.WriteLog("Elevador no pudo ser encontrado", ci_syslogs_1.Logger.Severities.Alert);
                        that.stateMachine.blokingType = 1;
                        that.motorStop(null,()=>{});
                        controlBlocking(callback);
                    }
                });
            }
            else {
                that.Log.WriteLog("Elevador encontrado en el piso: " + that.stateMachine.location, ci_syslogs_1.Logger.Severities.Debug);
                that.stateMachine.findProcess = false;
                callback(null);
            }
        }
        //Chequea posición del elevador según parámetro
        function checkPosition(pos) {
            return that.stateMachine.location === pos;
        }
        //Enciende el motor del elevador hacia abajo
        that.motorStartDown= function (data, callback) {
            try {
                if (checkPosition(7)) {
                    that.Log.WriteLog("El Elevador está al limite inferior, no puede bajar mas", ci_syslogs_1.Logger.Severities.Debug);
                    callback(null)
                }
                else {
                    that.mcp2.digitalWrite(Config.MCP_Motor.Down.value, that.mcp2.HIGH);
                    that.stateMachine.motorState = 2;
                    that.Log.WriteLog("Elevador Bajando", ci_syslogs_1.Logger.Severities.Debug);
                    that.emit("Sensor", { cmd: "Motor Start Down" });
                    callback(null)
                }
            }
            catch (e) {
                callback("Error al bajar ascensor");
                that.Log.WriteLog("Error al bajar ascensor" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Enciende el motor del elevador hacia arriba
        that.motorStartUp= function (data, callback) {
            try {
                if (checkPosition(Config.row[1].Piso)) {
                    that.Log.WriteLog("El Elevador está al limite superior, no puede subir mas", ci_syslogs_1.Logger.Severities.Debug);
                    callback(null)
                }else {
                    that.mcp2.digitalWrite(Config.MCP_Motor.UP.value, that.mcp2.HIGH);
                    that.stateMachine.motorState = 1;
                    that.Log.WriteLog("Elevador subiendo", ci_syslogs_1.Logger.Severities.Debug);
                    that.emit("Sensor", { cmd: "Motor Start Up" });
                    callback(null)
                }
            }
            catch (e) {
                callback("Error al subir ascensor");
                that.Log.WriteLog("Error al subir ascensor" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Detiene el motor del elevador
        that.motorStop = function (data, callback){
            try {
                that.mcp2.digitalWrite(Config.MCP_Motor.Down.value, that.mcp2.LOW);
                that.mcp2.digitalWrite(Config.MCP_Motor.UP.value, that.mcp2.LOW);
                that.stateMachine.motorState = 0;
                that.Log.WriteLog("Elevador detenido", ci_syslogs_1.Logger.Severities.Debug);
                callback(null)
            }
            catch (e) {
                callback("Error al detener ascensor");
                that.Log.WriteLog("Error al detener ascensor" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        };
        //Inicia el motor de una cinta específica
        function motorCintaStart (row, coll, coll2) {
            try {
                async_1.parallel([
                    function () {
                        that.mcp1.digitalWrite(Number(row), that.mcp1.HIGH);
                    }, function () {
                        that.mcp1.digitalWrite(Number(coll), that.mcp1.HIGH);
                    }, function () {
                        if (coll2 != null) {
                            that.mcp1.digitalWrite(Number(coll2), that.mcp1.HIGH);
                        }
                    }
                ]);
                that.Log.WriteLog("Motor de celda activado", ci_syslogs_1.Logger.Severities.Debug);
            }
            catch (e) {
                that.Log.WriteLog("Error al actilet celda" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        }
        //Detiene el motor de una cinta específica
        function motorCintaStop (row, coll, coll2) {
            try {
                async_1.parallel([function () {
                    that.mcp1.digitalWrite(Number(row), that.mcp1.LOW);
                }, function () {
                    that.mcp1.digitalWrite(Number(coll), that.mcp1.LOW);
                }, function () {
                    if (coll2 != null) {
                        that.mcp1.digitalWrite(Number(coll2), that.mcp1.LOW);
                    }
                }]);
                that.Log.WriteLog("Motor de celda detenido", ci_syslogs_1.Logger.Severities.Debug);
            }
            catch (e) {
                that.Log.WriteLog("Error al actilet celda" + e.stack, ci_syslogs_1.Logger.Severities.Error);
            }
        }
        //Emite alerta de seguridad
        function emitSecurityAlert(msg) {
            that.Log.WriteLog("Alerta, de seguridad: " + msg, ci_syslogs_1.Logger.Severities.Alert);
            that.emit("Event", { cmd: "Alerta" });
        }
        //Controla acciones de según señales de sensores
        function controlSensors(piso, pin, state) {
            that.stateMachine.readSensor = true;
            //Se emite la alerta si se activa un sensor cuando esta activa el estado de seguridad
            if (that.stateMachine.securityMachine === true && pin !== Config.elevator.Up.PIN && pin !== Config.elevator.Down.PIN) {
                emitSecurityAlert("sensor activado cuando la máquina está inactiva pin: " + pin);
                gotoInitPosition(null,function (err) {
                    if (err != null) {
                        that.Log.WriteLog("Puerta asegurada por alerta de seguridad: " + pin, ci_syslogs_1.Logger.Severities.Debug);
                    }
                });
            }
            //Acciones cuando se activa
            that.Log.WriteLog("Sensor de piso " + piso + " en estado " + state + " PIN: " + pin, ci_syslogs_1.Logger.Severities.Debug);
            //Alertas de seguridad por activaciones de sensor inesperados
            switch (that.stateMachine.motorState) {
                case 0:
                    //Emite Alerta si se activa un sensor en espera por retiro del producto
                    if (that.stateMachine.isDelivery === true && piso < Config.row[7].Piso && piso !== that.stateMachine.location) {
                        emitSecurityAlert("sensor activado del piso " + piso + " cuando se espera por retiro del producto");
                        gotoInitPosition(null,function () {
                            that.Log.WriteLog("Puerta asegurada por evento inesperado mientras se retiraba el producto", ci_syslogs_1.Logger.Severities.Alert);
                        });
                    }
                    //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                    if (that.stateMachine.receivingItem === true && that.stateMachine.location === piso) {
                        that.emit("Item recibido", that.stateMachine.location, state);
                    }
                    break;
                case 1:
                    if (that.stateMachine.blokingType===0 && (that.stateMachine.isDispense === true || that.stateMachine.pollProcess === true)) {
                        Config.times[piso].timeToFloor = that.stateMachine.countTime;
                        that.Log.WriteLog("Tiempo establecido para el piso: " + piso + " es de: " + that.stateMachine.countTime, ci_syslogs_1.Logger.Severities.Debug);
                    }
                    //Detecta la posición del elevador cuando está en proceso de búsueda
                    if (that.stateMachine.location == null) {
                        that.Log.WriteLog("El elevador encontrado en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.location = piso;
                    }
                    //Actualiza ubicación del elevador si la posición es la siguiente
                    if (that.stateMachine.securityMachine === false && that.stateMachine.location - 1 === piso) {
                        that.Log.WriteLog("El elevador está en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.location = piso;
                        that.stateMachine.timeWithoutSensor = 100;
                    }
                    //Activa alerta si se activa un sensor contrario al avance del elevador
                    if (that.stateMachine.findProcess === false && piso > that.stateMachine.location) {
                        emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en subida");
                        that.stateMachine.blokingType = 4;
                    }
                    if (piso < that.stateMachine.goingTo) {
                        emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + that.stateMachine.goingTo);
                        that.stateMachine.blokingType = 6;
                    }
                    break;
                case 2:
                    if (that.stateMachine.location == null) {
                        that.Log.WriteLog("El elevador encontrado en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.location = piso;
                    }
                    //Actualiza ubicación del elevador si la posición es la siguiente
                    if (that.stateMachine.securityMachine === false && that.stateMachine.location + 1 === piso) {
                        that.Log.WriteLog("El elevador está en el piso: " + piso, ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.location = piso;
                        that.stateMachine.timeWithoutSensor = 100;
                    }
                    //Activa alerta si se activa un sensor contrario al avance del elevador
                    if (that.stateMachine.findProcess === false && piso < that.stateMachine.location) {
                        emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en bajada");
                        that.stateMachine.blokingType = 4;
                    }
                    if (piso > that.stateMachine.goingTo) {
                        emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición " + that.stateMachine.goingTo);
                        that.stateMachine.blokingType = 6;
                    }
                    break;
            }
            //Detecta que el elevador llego a la posición deseada
            if (that.stateMachine.goingTo === that.stateMachine.location) {
                //Si se dirige a hacer una entrega, baja un poco más
                if (that.stateMachine.isDelivery === true && that.stateMachine.goingTo === 7) {
                    that.Log.WriteLog("Bajando el elevador para retirar el producto", ci_syslogs_1.Logger.Severities.Debug);
                    setTimeout(function () {
                        that.motorStop(null,()=>{});
                    }, 300);
                }
                else {
                    that.motorStop(null,()=>{});
                }
            }
            that.emit("Sensor", { cmd: that.stateMachine.location, state: state });
        }
        //Control de mandos de controladora
        function manualController(pin, state) {
            if (state === false) {
                securityState(false);
                switch (pin) {
                    case Config.elevator.Up.PIN:
                        that.Log.WriteLog("Elevador subiendo de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                        that.mcp2.digitalWrite(Config.MCP_Motor.UP.value, that.mcp2.HIGH);
                        that.stateMachine.motorState = 1;
                        that.emit("Sensor", { cmd: "machine", data: "Motor Start Up by Control Board" });
                        break;
                    case Config.elevator.Down.PIN:
                        that.Log.WriteLog("Elevador bajando de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                        that.mcp2.digitalWrite(Config.MCP_Motor.Down.value, that.mcp2.HIGH);
                        that.stateMachine.motorState = 2;
                        that.emit("Sensor", { cmd: "machine", data: "Motor Start Down by Control Board" });
                        break;
                    case Config.general.Stop.PIN:
                        that.Log.WriteLog("Pines detenidos por Controladora", ci_syslogs_1.Logger.Severities.Debug);
                        stopAll(null);
                        that.stateMachine.motorState = 0;
                        break;
                }
            }
            else {
                that.Log.WriteLog("Elevador se detuvo de forma manual", ci_syslogs_1.Logger.Severities.Debug);
                that.motorStop(null,()=>{});
                that.emit("Sensor", { cmd: "machine", data: "Motor Stop Up by Control Board" });
                securityState(true);
            }
        }
        //Recibe señal de entrada y determina de donde proviene
        function mainSignal(pin, state) {
            switch (pin) {
                case Config.Sensor["1"].PIN:
                    controlSensors(1, pin, state);
                    break;
                case Config.Sensor["2"].PIN:
                    controlSensors(2, pin, state);
                    break;
                case Config.Sensor["3"].PIN:
                    controlSensors(3, pin, state);
                    break;
                case Config.Sensor["4"].PIN:
                    controlSensors(4, pin, state);
                    break;
                case Config.Sensor["5"].PIN:
                    controlSensors(5, pin, state);
                    break;
                case Config.Sensor["6"].PIN:
                    controlSensors(6, pin, state);
                    break;
                case Config.Sensor["7"].PIN:
                    controlSensors(7, pin, state);
                    break;
                case Config.Pulso.P1.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P2.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P3.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 3", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 3", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P4.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 4", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 4", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P5.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 5", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 5", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P6.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor vuelta piso 6", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor vuelta piso 6", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Aux.A1.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor Aux A1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor Aux A1", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Aux.A2.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso On sensor Aux A2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Off sensor Aux A2", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Card.Int.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso Card In On", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Card In Off", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.Card.Out.PIN:
                    if (state === true) {
                        that.Log.WriteLog("Pulso Card Out On", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    else {
                        that.Log.WriteLog("Pulso Card Out Off", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
                case Config.elevator.Up.PIN:
                    manualController(Config.elevator.Up.PIN, state);
                    break;
                case Config.elevator.Down.PIN:
                    manualController(Config.elevator.Down.PIN, state);
                    break;
                case Config.general.stop.PIN:
                    manualController(Config.general.Stop.PIN, state);
                    if (state === true) {
                        that.Log.WriteLog("Se detuvieron todas las salidas", ci_syslogs_1.Logger.Severities.Debug);
                    }
                    break;
            }
        }
        //Enviar el elevador a una fila específica con control de atascos
        that.GoTo = function (row,callback) {
            if (Config.floors[row].Enable === true) {
                securityState(false);
                that.Log.WriteLog("Elevador se dirige a la posición: " + row, ci_syslogs_1.Logger.Severities.Debug);
                that.stateMachine.goingTo = row;
                that.stateMachine.pinGoingTo = Config.row[row].PIN;
                if (that.stateMachine.location === row) {
                    that.Log.WriteLog("El elevador esta en posición", ci_syslogs_1.Logger.Severities.Debug);
                    callback(null);
                } else {
                    if (that.stateMachine.location > row) {
                        that.motorStartUp(null,()=>{});
                    }
                    else if (that.stateMachine.location < row) {
                        that.motorStartDown(null,()=>{});
                    }
                    that.stateMachine.initPosition = false;
                    //Espera la posición de destino y verifica atascos
                    controlTime(function (err) {
                        if (err != null) {
                            controlBlocking(callback)
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
        function prepareForDispense(callback, piso, height) {
            let timeForDown = height * that.stateMachine.timeSettingAdjust;
            if (checkPosition(piso)) {
                that.Log.WriteLog("Comenzando proceso de retroceso para ajuste de altura", ci_syslogs_1.Logger.Severities.Debug);
                that.motorStartDown(null,()=>{});
                setTimeout(function () {
                    that.motorStop(null,()=>{});
                    that.Log.WriteLog("Elevador ubicado y listo para recibir", ci_syslogs_1.Logger.Severities.Debug);
                    that.stateMachine.receivingItem = true;
                    callback(null);
                }, timeForDown);
            }
            else {
                that.Log.WriteLog("El elevador no está en posición para recibir", ci_syslogs_1.Logger.Severities.Error);
                callback("El elevador no está en posición para recibir");
            }
        }
        //Tiempo de espera para que el cliente retire el producto
        function waitForRemoveItem(callback) {
            if (Config.Is_empty === false) {
                that.Log.WriteLog("Hay un producto en el elevador para retirar", ci_syslogs_1.Logger.Severities.Debug);
                let wait_1 = setInterval(function () {
                    if (Config.Is_empty === true) {
                        callback(null);
                        clearInterval(wait_1);
                        wait_1 = null;
                    }
                }, 500);
            }
            else {
                that.Log.WriteLog("No Hay producto en el elevador, se ajustará en 30s", ci_syslogs_1.Logger.Severities.Debug);
                setTimeout(function () {
                    callback(null);
                }, 22000);
            }
        }
        //Proceso completo para dispensar artículo al cliente
        that.dispenseItem = function (data, callback) {
            that.stateMachine.isDispense = true;
            that.Log.WriteLog("Comenzando proceso de dispensar item en el piso " + data.piso, ci_syslogs_1.Logger.Severities.Debug);
            securityState(false);
            if (that.stateMachine.enableMachine === true && that.stateMachine.readyForDispense === true) {
                that.stateMachine.readyForDispense = false;
                that.Log.WriteLog("Comenzando proceso de dispensar item", ci_syslogs_1.Logger.Severities.Debug);
                async_1.series([
                    function (callback) {
                        that.Log.WriteLog("Step 1 Verificando posición de elevador", ci_syslogs_1.Logger.Severities.Debug);
                        findElevator(callback);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 2 Ubicando elevador en posición", ci_syslogs_1.Logger.Severities.Debug);
                        that.GoTo(data.piso,callback);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 3 Ajustando posición del elevador segun tamaño", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            prepareForDispense(callback, data.piso, data.height);
                        }, 1000);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 4 Dispensado artículo desde cinta", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            dispense(data.piso, data.c1, data.c2, callback);
                        }, 1000);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 5 Bajando elevador para realizar entrega", ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.receivingItem = false;
                        that.stateMachine.isDelivery = true;
                        setTimeout(function () {
                            that.GoTo(7,callback);
                        }, 1000);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 6 Esperando evento del retiro del articulo", ci_syslogs_1.Logger.Severities.Debug);
                        that.emit("Event", { cmd: "Ok_dispensing", data: true });
                        that.stateMachine.isDispense = false;
                        setTimeout(function () {
                            waitForRemoveItem(callback);
                        }, 2000);
                    },
                    function (callback) {
                        that.Log.WriteLog("Step 7 Asegurando puerta", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            gotoInitPosition(null,callback);
                        }, 8000);
                    }
                ], function (result) {
                    that.stateMachine.readyForDispense = true;
                    if (result == null) {
                        that.stateMachine.blokingType = 0;
                        that.stateMachine.attempts = 0;
                        that.Log.WriteLog('Proceso de Venta Completado', ci_syslogs_1.Logger.Severities.Debug);
                        callback(result);
                    } else {
                        that.Log.WriteLog("Proceso de Venta imcompleto",ci_syslogs_1.Logger.Severities.Debug);
                        that.Log.WriteLog("Error al dispensar: " + result, ci_syslogs_1.Logger.Severities.Alert);
                        disableMachine();
                        callback(result);
                    }
                });
            } else {
                that.Log.WriteLog("La máquina está deshabilitada, necesita revisión",ci_syslogs_1.Logger.Severities.Alert);
                callback("Máquina deshabilitada por falla en sensor serial");
            }
        };
        //Ubicar el elevador en la posición inicial
        function gotoInitPosition(data, callback) {
            that.stateMachine.findProcess = false;
            that.Log.WriteLog("InitPos - Elevador va a posición inicial", ci_syslogs_1.Logger.Severities.Debug);
            if (that.stateMachine.initPosition === true) {
                that.Log.WriteLog("InitPos - El elevador se encuentra en la posición inicial", ci_syslogs_1.Logger.Severities.Debug);
                callback(null);
            }
            else {
                async_1.series([
                    //Step 1 - Ubicando elevador en posicion 7
                    function (callback) {
                        that.Log.WriteLog("InitPos - Ubicando elevador en la parte inferior, piso 7", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            that.GoTo(7, callback);
                        }, 500);
                    },
                    //Step 2 - Ajustando altura de Elevador
                    function (callback) {
                        that.Log.WriteLog("InitPos - Ajustando altura para bloqueo de puerta principal", ci_syslogs_1.Logger.Severities.Debug);
                        setTimeout(function () {
                            that.motorStartUp(null,()=>{});
                            setTimeout(function () {
                                that.motorStop(null,()=>{});
                                securityState(true);
                                callback(null);
                            }, 400);
                        }, 500);
                    }
                ], function (result) {
                    if (result == null) {
                        that.Log.WriteLog("InitPos - Elevador ubicado en posición inicial", ci_syslogs_1.Logger.Severities.Debug);
                        securityState(true);
                        that.stateMachine.blokingType = 0;
                        that.stateMachine.attempts = 0;
                        that.stateMachine.initPosition = true;
                        callback(null);
                    }
                    else {
                        that.Log.WriteLog("Error ubicando en la posición inicial", ci_syslogs_1.Logger.Severities.Alert);
                        callback(result);
                    }
                });
            }
        }
        //Beta de dispensar
        function dispense(piso, coll_1, coll_2, callback) {
            let row = Config.row[piso].PIN;
            let c1 = Config.column[coll_1].PIN;
            let c2 = (coll_2 != null) ? Config.column[coll_2].PIN : null;
            if (checkPosition(piso)) {
                that.Log.WriteLog("Dispensando desde piso " + piso + " columna 1: " + c1 + " columna 2 " + c2, ci_syslogs_1.Logger.Severities.Debug);
                motorCintaStart(row, c1, c2);
                that.stateMachine.receivingItem = true;
                let countTime_1 = 100;
                let wait_2 = setInterval(function () {
                    countTime_1 += 100;
                    //Si se excede del tiempo estimado
                    if (countTime_1 > 10000) {
                        that.Log.WriteLog("Exceso de tiempo dispensando, countTime: " + countTime_1, ci_syslogs_1.Logger.Severities.Debug);
                        motorCintaStop(row, c1, c2);
                        callback("Tiempo excedido dispensando artículo");
                        clearInterval(wait_2);
                        wait_2 = null;
                    }
                    //Lee el sensor para leer llegada del producto
                    that.pollSensor({pin: Config.Sensor[piso].PIN}, function (err, value) {
                        //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                        if (value === true) {
                            that.emit("Item recibido", that.stateMachine.location, value);
                        }
                    });
                }, 100);
                that.once("Item recibido", function () {
                    motorCintaStop(row, c1, c2);
                    that.stateMachine.receivingItem = false;
                    callback(null);
                    clearInterval(wait_2);
                    wait_2 = null;
                });
            }
        }
        //Controla el tiempo de avance del motor
        function controlTime(callback) {
            //Espera la posición de destino
            let nPisos;
            let ready = false;
            that.stateMachine.timeWithoutSensor = 100;
            that.stateMachine.countTime = 100;
            that.stateMachine.readSensor = false;
            nPisos = (that.stateMachine.location != null) ? that.stateMachine.location - that.stateMachine.goingTo : 4;
            let time = 0;
            nPisos = (nPisos < 0) ? nPisos * -1 : nPisos;
            time = nPisos * 2700;
            that.Log.WriteLog("Se movera " + nPisos + " en un tiempo límite para llegar a destino es " + time, ci_syslogs_1.Logger.Severities.Debug);
            that.stateMachine.blokingType = 0;
            //Espera la posición de destino
            let wait = setInterval(function () {
                that.stateMachine.countTime += 100;
                that.stateMachine.timeWithoutSensor += 100;
                //Si llego sin problemas en el tiempo estimado
                ready = checkPosition(that.stateMachine.goingTo);
                //Lee el estado del sensor del piso destino
                if (that.stateMachine.goingTo !== 0) {
                    that.pollSensor({pin: Config.Sensor[that.stateMachine.goingTo].PIN}, function (err, value) {
                        that.Log.WriteLog("Elevador llego por tiempo lectura de pin", ci_syslogs_1.Logger.Severities.Debug);
                        ready = value;
                    });
                }
                //Detiene el elevador según tiempo estimado de piso
                if (that.stateMachine.countTime >= Config.times[that.stateMachine.goingTo].timeToFloor
                        && that.stateMachine.motorState === 1) {
                    ready = true;
                    that.Log.WriteLog("Elevador llego por tiempo límite de piso en: " + that.stateMachine.countTime + " ms", ci_syslogs_1.Logger.Severities.Debug);
                }
                if (ready === true) {
                    that.stateMachine.blokingType = 0;
                    that.stateMachine.attempts = 0;
                    clearInterval(wait);
                    wait = null;
                    callback(null);
                }
                //Si se excede del tiempo estimado
                if (that.stateMachine.countTime > time) {
                    that.Log.WriteLog("Leyendo posible atasco, countTime: " + that.stateMachine.countTime, ci_syslogs_1.Logger.Severities.Debug);
                    //Si es subiendo - Bloqueo en proceso de dispensa subiendo y se paso del tiempo de posición
                    if (that.stateMachine.motorState === 1 && that.stateMachine.isDispense === true) {
                        that.stateMachine.blokingType = 3;
                    }
                    //Si es bajando - Bloqueo en proceso de dispensa bajando y se paso del tiempo de posición
                    if (that.stateMachine.motorState === 2 && that.stateMachine.isDispense === true) {
                        that.stateMachine.blokingType = 2;
                    }
                    callback("Bloqueo");
                    clearInterval(wait);
                    wait = null;
                }
                //Si han pasado 4 segundos sin detectar ningun sensor
                if (that.stateMachine.timeWithoutSensor > 4000 && that.stateMachine.readSensor === false) {
                    that.stateMachine.blokingType = 5;
                    callback("Bloqueo");
                    clearInterval(wait);
                    wait = null;
                }
                //Si está definido un tipo de bloqueo
                if (that.stateMachine.blokingType !== 0) {
                    callback("Bloqueo");
                    clearInterval(wait);
                    wait = null;
                }
            }, 100);
        }
        //Controla intentos de desatascos del elevador
        function controlBlocking(callback) {
            that.stateMachine.attempts++;
            that.Log.WriteLog("Intentos " + that.stateMachine.attempts, ci_syslogs_1.Logger.Severities.Debug);
            that.motorStop(null,()=>{});
            securityState(false);
            if (that.stateMachine.attempts > 2) {
                that.Log.WriteLog("Elevador bloqueado luego de 2 intentos - Se requiere revisión", ci_syslogs_1.Logger.Severities.Critical);
                //callback("Elevador bloqueado luego de 2 intentos - Se requiere revisión")
                disableMachine();
            } else {
                that.Log.WriteLog("Comenzando proceso de desbloqueo número: " + that.stateMachine.attempts, ci_syslogs_1.Logger.Severities.Debug);
                that.Log.WriteLog("Intento de desbloqueo de tipo: " + that.stateMachine.blokingType, ci_syslogs_1.Logger.Severities.Alert);
                switch (that.stateMachine.blokingType) {
                    //Listo - Probar
                    case 1: //Arranca y no detecta sensores y no se encuentra
                        that.stateMachine.location = null;
                        that.stateMachine.blokingType = 0;
                        that.Log.WriteLog("Step 1 - Reiniciando sensores", ci_syslogs_1.Logger.Severities.Alert);
                        resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                that.Log.WriteLog("Step 2 - Buscando elevador", ci_syslogs_1.Logger.Severities.Alert);
                                findElevator(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
                                        disableMachine();
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
                        that.stateMachine.blokingType = 0;
                        disableMachine();
                        callback("Se detectó un atasco al bajar para entregar - La máquina está deshabilitada por seguridad");
                        break;
                    //Listo - Probado
                    case 3: //Atasco yendo a buscar un artículo, se detiene y resume el proceso
                        that.Log.WriteLog("Step 1 - Bajando para desatascar", ci_syslogs_1.Logger.Severities.Debug);
                        that.stateMachine.blokingType = 0;
                        that.motorStartDown(null,()=>{});
                        setTimeout(function () {
                            that.motorStop(null,()=>{});
                            that.Log.WriteLog("Step 1 - Resumiendo proceso de dispensa", ci_syslogs_1.Logger.Severities.Debug);
                            setTimeout(function () {
                                callback(null);
                            }, 1500);
                        }, 300);
                        break;
                    //Listo - Probar
                    case 4: //Se detecta un evento inesperado en los sensores
                        that.stateMachine.blokingType = 0;
                        that.stateMachine.isDelivery = false;
                        callback("Se detecto un evento inesperado");
                        setTimeout(function () {
                            gotoInitPosition(null,function (err) {
                                disableMachine();
                                if (err == null) {
                                    that.Log.WriteLog("Elevador ubicado en posicion inicial por seguridad", ci_syslogs_1.Logger.Severities.Alert);
                                    that.stateMachine.attempts = 0;
                                }
                                else {
                                    that.Log.WriteLog("Maquina deshabilitada, no se pudo estabilizar", ci_syslogs_1.Logger.Severities.Alert);
                                }
                            });
                        }, 1000);
                        break;
                    //Listo - Probar
                    case 5: //Si han pasado 4 segundos sin detectar ningun sensor cuando el motor está en movimiento
                        that.Log.WriteLog("Step 1 - Reseteando sensores", ci_syslogs_1.Logger.Severities.Alert);
                        that.stateMachine.blokingType = 0;
                        this.resetSensors(function (err) {
                            if (err) {
                                callback("No se pudo recuperar sensores");
                            }
                            else {
                                that.stateMachine.location = null;
                                that.Log.WriteLog("Step 2 - Buscando elevador", ci_syslogs_1.Logger.Severities.Alert);
                                findElevator(function (err) {
                                    if (err) {
                                        callback("Imposible conseguir el elevador");
                                    }
                                    else {
                                        that.GoTo(that.stateMachine.goingTo,function (err) {
                                            callback(err);
                                        });
                                    }
                                });
                            }
                        });
                        break;
                    //Listo - Probar
                    case 6:
                        //Si pasó de posición
                        that.stateMachine.blokingType = 0;
                        setTimeout(()=>{
                            gotoInitPosition(null,(err)=>{});
                            that.Log.WriteLog("Step 1 - Llevando a la posicion inicial por seguridad", ci_syslogs_1.Logger.Severities.Alert);
                            callback("No se pudo completar el proceso por alerta de sensor")
                        },1500);
                        break;
                }
            }
        }
        //Proceso de establecer valores estimados de llegada a piso
        that.pollTimeProcess = function (data,callback) {
            securityState(false);
            that.Log.WriteLog("Iniciando proceso de lectura encuesta de tiempos", ci_syslogs_1.Logger.Severities.Debug);
            async_1.series([
                function (callback) {
                    that.Log.WriteLog("Step 1 - Subiendo para chequear tiempos", ci_syslogs_1.Logger.Severities.Debug);
                    that.stateMachine.pollProcess = true;
                    setTimeout(function () {
                        that.GoTo(1,callback);
                    }, 1000);
                },
                function (callback) {
                    that.Log.WriteLog("Step 2 - Llevando a posición inicial", ci_syslogs_1.Logger.Severities.Debug);
                    setTimeout(function () {
                        gotoInitPosition(null,callback);
                    }, 1000);
                }
            ], function (result) {
                if (result == null) {
                    that.Log.WriteLog('Proceso de encuesta completo', ci_syslogs_1.Logger.Severities.Debug);
                    that.stateMachine.pollProcess = false;
                    that.Log.WriteLog('Tiempos establecidos: ' + JSON.stringify(Config.times), ci_syslogs_1.Logger.Severities.Debug);
                    callback(result);
                }
                else {
                    that.Log.WriteLog("Error en proceso de encuesta: " + result, ci_syslogs_1.Logger.Severities.Error);
                    callback(result);
                }
            });
        };
        //Leer pin de entrada Gpio
        that.pollSensor = function (data, callback) {
            rpi_gpio_1.read(data.pin, function (err, value) {
                if (err) {
                    that.Log.WriteLog("Error leyendo el pin " + data.pin, ci_syslogs_1.Logger.Severities.Error);
                    that.Log.WriteLog(err, ci_syslogs_1.Logger.Severities.Error);
                    callback(err);
                }
                else {
                    if (value === true) {
                        that.Log.WriteLog("Leyendo pin " + data.pin + " en estado " + value, ci_syslogs_1.Logger.Severities.Debug);
                        callback(null, value);
                    }
                }
            });
        };
        //Test celdas
        that.testCeldas = function (data, callback) {
            let row = Config.row[data.piso].PIN;
            let c1 = Config.column[data.coll_1].PIN;
            let c2 = (data.coll_2 != null) ? Config.column[data.coll_2].PIN : null;
            that.Log.WriteLog("Iniciando test de celda", ci_syslogs_1.Logger.Severities.Debug);
            motorCintaStart(row, c1, c2);
            setTimeout(function () {
                motorCintaStop(row, c1, c2);
                console.log("Test de celda finalizado");
                callback(null);
            }, 4000);
        };
        //Test de pines de salida
        that.testPinOut = function (data, callback) {
            that.Log.WriteLog("Iniciando test de Pin de salida " + data.pin + " de MCP " + data.mcp, ci_syslogs_1.Logger.Severities.Debug);
            try {
                switch (data.mcp) {
                    case 1:
                        that.Log.WriteLog("Encendiendo pin " + data.pin + " de MCP1", ci_syslogs_1.Logger.Severities.Debug);
                        that.mcp1.digitalWrite(data.pin, that.mcp1.HIGH);
                        setTimeout(function () {
                            that.mcp1.digitalWrite(data.pin, that.mcp1.LOW);
                            console.log("Test de celda finalizado");
                            callback(null);
                        }, 3000);
                        break;
                    case 2:
                        that.Log.WriteLog("Encendiendo pin " + data.pin + " de MCP2", ci_syslogs_1.Logger.Severities.Debug);
                        that.mcp2.digitalWrite(data.pin, that.mcp2.HIGH);
                        setTimeout(function () {
                            that.mcp2.digitalWrite(data.pin, that.mcp2.LOW);
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
    }
};