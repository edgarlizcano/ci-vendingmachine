import Config from './ConfigMachine';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import {EventEmitter} from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async from "async";
import {Logger} from "ci-syslogs";
import {Sensor} from "./Sensor";

export class ControllerMachine extends EventEmitter{
    private Log = new Logger("0.0.0.0", Logger.Facilities.Machine);
    private mcp1 = new MCP23017({
        address: 0x20,
        device: '/dev/i2c-1',
        debug: true
    });
    private mcp2 = new MCP23017({
        address: 0x21,
        device: '/dev/i2c-1',
        debug: true
    });
    //Variables de control de la máquina
    private stateMachine:any={
        goingTo         : 0,        //Controla el destino del elevador al moverlo
        motorState      : 0,        //Controla el estado del motor. motorState: [0 stop, 1 going up, 2 going down]
        location        : null,     //Indica la posición actual del elevador
        sensorPiso      : null,     //Sensor serial de piso
        receivingItem   : false,    //Estado de recepción de articulo en la bandeja
        isDelivery      : false,    //Estado de despacho de item
        isDispense      : false,    //Estado de despacho de item
        enableMachine   : false,    //Estado de la máquina, si esta habilitada y lista
        securityMachine : false,    //Estado de seguridad de la máquina
        initPosition    : false,    //Indica si el elevador está en la posición inicial
        blokingType     : 0,        //Indica el tipo de bloqueo
        attempts        : 0,        //Indica el número de intentos de desbloqueo
        findProcess     : false,    //Indica que la máquina se encuentra en proceso de búsqueda
        pollProcess     : false,
        readyForDispense: true,     //Indica que la máquina se encuentra en lista para dispensar
        timeSettingAdjust: 16,      //Indica el tiempo de ajuste del elevador
        countTime       : 100,      //Define el tiempo de un desplazamiento
        timeToDisepense : 100
    };
    constructor(){
        super();
        this.Log.WriteLog("Control inicializado Version 8 Lite", Logger.Severities.Debug);
        Gpio.on('change', this.mainSignal);
        this.initOuts();
        this.initSensors((err:any)=>{
            if(err){
                this.Log.WriteLog(err, Logger.Severities.Error);
            }
        });
        this.stateMachine.sensorPiso = new Sensor();
        this.Log.WriteLog("Chequeando Sensor Serial", Logger.Severities.Debug);
        this.stateMachine.enableMachine=true;// Modo prueba
        setTimeout(()=>{
            if(this.stateMachine.sensorPiso.isCheck==true){
                this.securityState(false);
                if(this.stateMachine.location==null){
                    this.pollAllSensors((err:any)=>{
                       if(err==null){
                           this.findElevator((cb:any)=>{
                               if(cb==null){
                                   this.Log.WriteLog("Fin de proceso de busqueda de elevador", Logger.Severities.Debug);
                                   setTimeout(()=>{
                                       this.gotoInitPosition((err:any)=>{
                                           if (err!=null){
                                               this.Log.WriteLog(err, Logger.Severities.Error);
                                           }else{
                                               this.Log.WriteLog("Elevador Listo", Logger.Severities.Debug);
                                               this.enableMachine();
                                           }
                                       })
                                   },1000)
                               }
                           });
                       }else{
                           this.Log.WriteLog(err, Logger.Severities.Error);
                           this.stateMachine.enableMachine=false;
                       }
                    });
                }
            }else{
                this.emit("Event",{cmd:"Error_puerto_serial"})
            }
        },5000)
    };

    //Habilita o deshabilita seguridad
    private securityState=(state:boolean)=>{
        this.stateMachine.securityMachine=state;
        this.Log.WriteLog("La seguridad está en: "+this.stateMachine.securityMachine, Logger.Severities.Debug);
    };
    //Inicializa salidas
    private initOuts= ():void=> {
        this.Log.WriteLog("Inicializando salidas", Logger.Severities.Debug);
        for (let i = 0; i < 16; i++) {
            try{
                this.mcp1.pinMode(i, this.mcp1.OUTPUT);
                this.Log.WriteLog("Pin "+i+" de MPC1 Inicializado", Logger.Severities.Debug);
            }catch (e) {
                this.Log.WriteLog("Error al inicializar Pin: "+i+ " de MCP1", Logger.Severities.Error);
            }
            try{
                this.mcp2.pinMode(i, this.mcp2.OUTPUT);
                this.Log.WriteLog("Pin "+i+" de MPC2 Inicializado", Logger.Severities.Debug);
            }catch (e) {
                this.Log.WriteLog("Error al inicializar Pin: "+i+ " de MCP2", Logger.Severities.Error);
            }
        }
        this.Log.WriteLog("Inicialización exitosa", Logger.Severities.Debug);
    };
    //Inicializa sensores
    private initSensors= (callback:any):void =>{
        try {
            this.Log.WriteLog("Inicializando Sensores", Logger.Severities.Debug);
            Gpio.setup(Config.Sensor[1].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[2].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[3].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[4].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[5].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[6].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.Sensor[7].PIN, Gpio.DIR_IN, Gpio.EDGE_RISING);
            Gpio.setup(Config.elevator.Up.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Config.elevator.Down.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Config.general.stop.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            //Gpio.setup(Config.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            //Gpio.setup(Config.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            //Gpio.setup(Config.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            //Gpio.setup(Config.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            this.Log.WriteLog("Sensores Listos", Logger.Severities.Debug);
            callback(null)
        }catch(e) {
            this.Log.WriteLog("Error al iniciar los sensores de entrada", Logger.Severities.Error);
            callback("Error al iniciar los sensores de entrada. "+e.stackTrace)
        }
    };
    //Resetear sensores
    private resetSensors=(callback:any):void=>{
        _async.series([
            (callback:any)=>{
                this.closeSensors(callback)
            },
            (callback:any)=>{
                this.initSensors(callback)
            }
        ],(result?:any)=> {
            if(result == null) {
                callback(result);

                this.Log.WriteLog('Sensores Reiniciados '+result, Logger.Severities.Debug);
            }else{
                callback(result);
                this.Log.WriteLog("Error: "+result, Logger.Severities.Error);
            }
        })
    };
    //Deshabilita todos los sensores
    public closeSensors= (callback:any):void=> {
        try {
            Gpio.destroy((err:any)=>{
                if(err==null){
                    this.Log.WriteLog("Sensores deshabilidatos", Logger.Severities.Debug);
                    callback(null)
                }
            });
        }catch(e) {
            this.Log.WriteLog(e.stack+"Error detener sensores ", Logger.Severities.Error);
            callback(e);
        }
    };
    //Detiene todos los pines de salida
    public stopAll=(callback:any)=>{
        this.Log.WriteLog("Deteniendo salidas", Logger.Severities.Debug);
        for (let i = 0; i < 16; i++) {
            try{
                this.mcp1.digitalWrite(i, this.mcp1.LOW);
                this.Log.WriteLog("Pin "+i+" de MPC1 Detenido", Logger.Severities.Debug);
            }catch (e) {
                this.Log.WriteLog("Error al detener Pin: "+i+ " de MCP1", Logger.Severities.Error);
            }
            try{
                this.mcp2.digitalWrite(i, this.mcp2.LOW);
                this.Log.WriteLog("Pin "+i+" de MPC2 Detenido", Logger.Severities.Debug);
            }catch (e) {
                this.Log.WriteLog("Error al detener Pin: "+i+ " de MCP2", Logger.Severities.Error);
            }
        }
        callback = null
    };
    //Busqueda del elevador
    private findElevator=(callback:any):void=>{
        this.stateMachine.findProcess = true;
        let timeUp:any;
        //Proceso de busqueda de elevador
        if(this.stateMachine.location == null){
            this.Log.WriteLog("Ubicación desconocida - Iniciando búsqueda", Logger.Severities.Debug);
            _async.series([
                (callback:any)=>{
                    this.Log.WriteLog("Step 1 - Subiendo en búsqueda del elevador", Logger.Severities.Debug);
                    this.motorStartUp();
                    let count:number;
                    timeUp = setInterval(()=>{
                        count = count + 100;
                        if(this.stateMachine.location !=null){
                            this.motorStop();
                            callback(true);
                            clearInterval(timeUp);
                            timeUp = null
                        }
                        if(count>3500){
                            this.motorStop();
                            callback(null);
                            clearInterval(timeUp);
                            timeUp = null
                        }
                    },100)
                },
                (callback:any)=>{
                    this.Log.WriteLog("Step 2 - Bajando en búsqueda del elevador", Logger.Severities.Debug);
                    this.motorStartDown();
                    let count:number;
                    timeUp = setInterval(()=>{
                        count = count + 100;
                        if(this.stateMachine.location !=null){
                            this.motorStop();
                            callback(true);
                            clearInterval(timeUp);
                            timeUp = null
                        }
                        if(count>3000){
                            this.motorStop();
                            callback(null);
                            clearInterval(timeUp);
                            timeUp = null
                        }
                    },100)
                },
            ],(error:any)=>{
                if (error == true){
                    this.Log.WriteLog("Elevador ubicado en "+ this.stateMachine.location, Logger.Severities.Error);
                    this.gotoInitPosition(callback)
                }else{
                    this.Log.WriteLog("Elevador no pudo ser encontrado", Logger.Severities.Alert);
                    this.stateMachine.blokingType = 1;
                    this.motorStop();
                    this.controlBlocking(callback);
                }
            })
        }else{
            this.Log.WriteLog("Elevador encontrado en el piso: "+this.stateMachine.location, Logger.Severities.Debug);
            this.stateMachine.findProcess = false;
            callback(null)
        }
    };
    //Chequea posición del elevador según parámetro
    private checkPosition=(pos: number):boolean=>{
        return this.stateMachine.location == pos;
    };
    //Enciende el motor del elevador hacia abajo
    public motorStartDown= () =>{
        try {
            if(this.checkPosition(7)){
                this.Log.WriteLog("El Elevador está al limite inferior, no puede bajar mas", Logger.Severities.Debug);
            }else{
                this.mcp2.digitalWrite(Config.MCP_Motor.Down.value, this.mcp2.HIGH);
                this.stateMachine.motorState = 2;
                this.Log.WriteLog("Elevador Bajando", Logger.Severities.Debug);
                this.emit("Sensor",{cmd:"Motor Start Down"});
            }
        }catch(e) {
            this.Log.WriteLog("Error al bajar ascensor "+e.stack, Logger.Severities.Error);
        }
    };
    //Enciende el motor del elevador hacia arriba
    public motorStartUp= () =>{
        try {
            if(this.checkPosition(Config.row[1].Piso)){
                this.Log.WriteLog("El Elevador está al limite superior, no puede subir mas", Logger.Severities.Debug);
            }else{
                this.mcp2.digitalWrite(Config.MCP_Motor.UP.value, this.mcp2.HIGH);
                this.stateMachine.motorState = 1;
                this.Log.WriteLog("Elevador subiendo", Logger.Severities.Debug);
                this.emit("Sensor",{cmd:"Motor Start Up"});
            }
        }catch(e) {
            this.Log.WriteLog("Error al subir ascensor "+e.stack, Logger.Severities.Error);
        }
    };
    //Detiene el motor del elevador
    public motorStop= () =>{
        try {
            this.mcp2.digitalWrite(Config.MCP_Motor.Down.value, this.mcp2.LOW);
            this.mcp2.digitalWrite(Config.MCP_Motor.UP.value, this.mcp2.LOW);
            this.stateMachine.motorState = 0;
            this.Log.WriteLog("Elevador detenido", Logger.Severities.Debug);
        }catch(e) {
            this.Log.WriteLog("Error al detener ascensor"+e.stack, Logger.Severities.Error);
        }
    };
    //Inicia el motor de una cinta específica
    public motorCintaStart= (row: number, coll:number, coll2:number|null) =>{
        try {
            _async.parallel([
                ()=>{
                    this.mcp1.digitalWrite(Number(row), this.mcp1.HIGH);
                },()=>{
                    this.mcp1.digitalWrite(Number(coll), this.mcp1.HIGH);
                },()=>{
                    if(coll2!=null){
                        this.mcp1.digitalWrite(Number(coll2), this.mcp1.HIGH);
                    }
                }]);
            this.Log.WriteLog("Motor de celda activado", Logger.Severities.Debug);
        }catch(e) {
            this.Log.WriteLog("Error al activar celda"+e.stack, Logger.Severities.Error);
        }
    };
    //Detiene el motor de una cinta específica
    public motorCintaStop= (row: number, coll:number, coll2:number|null) =>{
        try {
            _async.parallel([()=>{
                this.mcp1.digitalWrite(Number(row), this.mcp1.LOW);
            },()=>{
                this.mcp1.digitalWrite(Number(coll), this.mcp1.LOW);
            },()=>{
                if(coll2!=null){
                    this.mcp1.digitalWrite(Number(coll2), this.mcp1.LOW);
                }
            }]);
            this.Log.WriteLog("Motor de celda detenido", Logger.Severities.Debug);
        }catch(e) {
            this.Log.WriteLog("Error al activar celda"+e.stack, Logger.Severities.Error);
        }
    };
    //Emite alerta de seguridad
    private emitSecurityAlert= (msg: string)=>{
        this.Log.WriteLog("Alerta, de seguridad: "+msg, Logger.Severities.Alert);
        this.emit("Event",{cmd:"Alerta"})
    };
    //Controla acciones de según señales de sensores
    private controlSensors=(piso:number,pin:number, state:boolean)=>{
        this.stateMachine.readSensor = true;
        //Se emite la alerta si se activa un sensor cuando esta activa el estado de seguridad
        if(this.stateMachine.securityMachine==true && pin!=Config.elevator.Up.PIN && pin!=Config.elevator.Down.PIN){
            this.emitSecurityAlert("sensor activado cuando la máquina está inactiva pin: "+pin);
            this.gotoInitPosition((err:any)=>{
                if(err!=null){
                    this.Log.WriteLog("Puerta asegurada por alerta de seguridad: "+pin, Logger.Severities.Debug);
                }
            });
        }
        //Acciones cuando se activa
        this.Log.WriteLog("Sensor de piso "+piso+" en estado "+state+" PIN: "+pin, Logger.Severities.Debug);
        //Alertas de seguridad por activaciones de sensor inesperados
        switch (this.stateMachine.motorState) {
            case 0:
                //Emite Alerta si se activa un sensor en espera por retiro del producto
                if(this.stateMachine.isDelivery == true && piso<Config.row[7].Piso && piso!=this.stateMachine.location){
                    this.emitSecurityAlert("sensor activado del piso "+piso+" cuando se espera por retiro del producto");
                    this.gotoInitPosition(()=>{
                        this.Log.WriteLog("Puerta asegurada por evento inesperado mientras se retiraba el producto", Logger.Severities.Alert);
                    })
                }
                //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                if(this.stateMachine.receivingItem == true && this.stateMachine.location == piso){
                    this.emit("Item recibido",this.stateMachine.location,state);
                }
                break;
            case 1:
                //Detecta la posición del elevador cuando está en proceso de búsueda
                if(this.stateMachine.location == null){
                    this.Log.WriteLog("El elevador encontrado en el piso: "+piso, Logger.Severities.Debug);
                    this.stateMachine.location = piso;
                }
                //Actualiza ubicación del elevador si la posición es la siguiente
                if(this.stateMachine.securityMachine == false && this.stateMachine.location-1 == piso){
                        this.Log.WriteLog("El elevador está en el piso: "+piso, Logger.Severities.Debug);
                        this.stateMachine.location = piso;
                        this.stateMachine.timeWithoutSensor = 100;
                }
                //Activa alerta si se activa un sensor contrario al avance del elevador
                if (this.stateMachine.findProcess == false && piso > this.stateMachine.location) {
                    this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en subida");
                    this.stateMachine.blokingType = 4;
                }
                if(piso<this.stateMachine.goingTo){
                    this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición "+this.stateMachine.goingTo);
                    this.stateMachine.blokingType = 5;
                }
                break;
            case 2:
                if(this.stateMachine.location == null){
                    this.Log.WriteLog("El elevador encontrado en el piso: "+piso, Logger.Severities.Debug);
                    this.stateMachine.location = piso;
                }
                //Actualiza ubicación del elevador si la posición es la siguiente
                if(this.stateMachine.securityMachine == false && this.stateMachine.location+1 == piso){
                    this.Log.WriteLog("El elevador está en el piso: "+piso, Logger.Severities.Debug);
                    this.stateMachine.location = piso;
                    this.stateMachine.timeWithoutSensor = 100;
                }
                //Activa alerta si se activa un sensor contrario al avance del elevador
                if (this.stateMachine.findProcess == false && piso < this.stateMachine.location) {
                    this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en bajada");
                    this.stateMachine.blokingType = 4;
                }
                if(piso>this.stateMachine.goingTo){
                    this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición "+this.stateMachine.goingTo);
                    this.stateMachine.blokingType = 5;
                }
                break;
            }
            //Detecta que el elevador llego a la posición deseada
            if(this.stateMachine.goingTo == this.stateMachine.location){
                //Si se dirige a hacer una entrega, baja un poco más
                if(this.stateMachine.isDelivery==true && this.stateMachine.goingTo == 7){
                    this.Log.WriteLog("Bajando el elevador para retirar el producto", Logger.Severities.Debug);
                    setTimeout(()=>{
                        this.motorStop();
                    },300)
                }else{
                    this.motorStop();
                }
            }
        this.emit("Sensor",{cmd:this.stateMachine.location,state:state});
    };
    //Control de mandos de controladora
    private manualController = (pin:number, state:boolean)=>{
        if (state === false) {
            this.securityState(false);
            switch (pin) {
                case Config.elevator.Up.PIN:
                    this.Log.WriteLog("Elevador subiendo de forma manual", Logger.Severities.Debug);
                    this.mcp2.digitalWrite(Config.MCP_Motor.UP.value, this.mcp2.HIGH);
                    this.stateMachine.motorState = 1;
                    this.emit("Sensor",{cmd:"machine", data:"Motor Start Up by Control Board"});
                    break;
                case Config.elevator.Down.PIN:
                    this.Log.WriteLog("Elevador bajando de forma manual", Logger.Severities.Debug);
                    this.mcp2.digitalWrite(Config.MCP_Motor.Down.value, this.mcp2.HIGH);
                    this.stateMachine.motorState = 2;
                    this.emit("Sensor",{cmd:"machine", data:"Motor Start Down by Control Board"});
                    break;
                case Config.general.Stop.PIN:
                    this.Log.WriteLog("Pines detenidos por Controladora", Logger.Severities.Debug);
                    this.stopAll(null);
                    this.stateMachine.motorState = 0;
                    break;
            }
        } else {
            this.Log.WriteLog("Elevador se detuvo de forma manual", Logger.Severities.Debug);
            this.motorStop();
            this.emit("Sensor",{cmd:"machine", data:"Motor Stop Up by Control Board"});
            this.securityState(true)
        }
    };
    //Recibe señal de entrada y determina de donde proviene
    private mainSignal=(pin:number,state:boolean)=>{
            switch (pin) {
                case Config.Sensor["1"].PIN:
                    this.controlSensors(1,pin,state);
                    break;
                case Config.Sensor["2"].PIN:
                    this.controlSensors(2,pin,state);
                    break;
                case Config.Sensor["3"].PIN:
                    this.controlSensors(3,pin,state);
                    break;
                case Config.Sensor["4"].PIN:
                    this.controlSensors(4,pin,state);
                    break;
                case Config.Sensor["5"].PIN:
                    this.controlSensors(5,pin,state);
                    break;
                case Config.Sensor["6"].PIN:
                    this.controlSensors(6,pin,state);
                    break;
                case Config.Sensor["7"].PIN:
                    this.controlSensors(7,pin,state);
                    break;
                case Config.Pulso.P1.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 1", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 1", Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P2.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 2", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 2", Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P3.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 3", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 3", Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P4.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 4", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 4", Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P5.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 5", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 5", Logger.Severities.Debug);
                    }
                    break;
                case Config.Pulso.P6.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor vuelta piso 6", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor vuelta piso 6", Logger.Severities.Debug);
                    }
                    break;
                case Config.Aux.A1.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor Aux A1", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor Aux A1", Logger.Severities.Debug);
                    }
                    break;
                case Config.Aux.A2.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso On sensor Aux A2", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Off sensor Aux A2", Logger.Severities.Debug);
                    }
                    break;
                case Config.Card.Int.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso Card In On", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Card In Off", Logger.Severities.Debug);
                    }
                    break;
                case Config.Card.Out.PIN:
                    if (state === true) {
                        this.Log.WriteLog("Pulso Card Out On", Logger.Severities.Debug);
                    } else {
                        this.Log.WriteLog("Pulso Card Out Off", Logger.Severities.Debug);
                    }
                    break;
                case Config.elevator.Up.PIN:
                    this.manualController(Config.elevator.Up.PIN, state);
                    break;
                case Config.elevator.Down.PIN:
                    this.manualController(Config.elevator.Down.PIN, state);
                    break;
                case Config.general.stop.PIN:
                    this.manualController(Config.general.Stop.PIN, state);
                    if (state === true) {
                        this.Log.WriteLog("Se detuvieron todas las salidas", Logger.Severities.Debug);
                    }
                    break;
            }
    };
    //Enviar el elevador a una fila específica con control de atascos
    public GoTo=(callback:any,row:number)=>{
        if(Config.floors[row].Enable == true){
            this.securityState(false);
            this.Log.WriteLog("Elevador se dirige a la posición: "+row, Logger.Severities.Debug);
            this.stateMachine.goingTo = row;
            this.stateMachine.pinGoingTo = Config.row[row].PIN;
            if(this.stateMachine.location==row){
                this.Log.WriteLog("El elevador esta en posición", Logger.Severities.Debug);
                callback(null);
            }else{
                if(this.stateMachine.location>row){
                    this.motorStartUp();
                }else if(this.stateMachine.location<row){
                    this.motorStartDown();
                }
                this.stateMachine.initPosition = false;
                //Espera la posición de destino y verifica atascos
                this.controlTime((err:any)=>{
                    if(err!=null){
                        // if(this.stateMachine.blokingType==4){
                        //     callback("Error por alerta de sensor activado")
                        // }
                        this.controlBlocking((err:any)=>{
                            if(err==null){
                                this.Log.WriteLog("Elevador ubicado en posicion segura", Logger.Severities.Debug);
                            }
                        })
                    }else{
                        callback(null);
                    }
                });
            }
        }else{
            callback("El piso de destino no está habilitado para esta maquina");
        }

    };
    //Prepara y ajusta posición del elevador para recibir artículo
    private prepareForDispense=(callback: any, height:number)=> {
        let timeForDown = height * this.stateMachine.timeSettingAdjust;
        if (this.checkPosition(this.stateMachine.location)) {
            this.Log.WriteLog("Comenzando proceso de retroceso para ajuste de altura", Logger.Severities.Debug);
            this.motorStartDown();
            setTimeout(() => {
                this.motorStop();
                this.Log.WriteLog("Elevador ubicado y listo para recibir", Logger.Severities.Debug);
                this.stateMachine.receivingItem= true;
                callback(null)
            }, timeForDown)
        } else {
            this.Log.WriteLog("El elevador no está en posición para recibir", Logger.Severities.Error);
        }
    };
    //Tiempo de espera para que el cliente retire el producto
    private waitForRemoveItem=(callback:any)=>{
        if(Config.Is_empty == false){
            this.Log.WriteLog("Hay un producto en el elevador para retirar", Logger.Severities.Debug);
            let wait:any = setInterval(()=>{
                if (Config.Is_empty == true){
                    callback(null);
                    clearInterval(wait);
                    wait=null;
                }
            },500)
        }else{
            this.Log.WriteLog("No Hay producto en el elevador, se ajustará en 30s", Logger.Severities.Debug);
            setTimeout(()=>{
                callback(null)
            },22000)
        }
    };
    //Proceso completo para dispensar artículo al cliente
    public dispenseItem=(piso: number, c1:number,c2:number|null, height: number, callback:callback)=>{
        this.stateMachine.isDispense = true;
        this.Log.WriteLog("Comenzando proceso de dispensar item en el piso "+piso, Logger.Severities.Debug);
        this.securityState(false);
        if(this.stateMachine.enableMachine == true && this.stateMachine.readyForDispense == true){
                this.stateMachine.readyForDispense = false;
                this.Log.WriteLog("Comenzando proceso de dispensar item", Logger.Severities.Debug);
                _async.series([
                    (callback:any)=>{
                        this.Log.WriteLog("Step 1 Verificando posición de elevador", Logger.Severities.Debug);
                        if(this.checkPosition(7)){
                            callback(null)
                        }else{
                            this.findElevator(callback);
                        }
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 2 Ubicando elevador en posición", Logger.Severities.Debug);
                        this.GoTo(callback,piso);
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 3 Ajustando posición del elevador segun tamaño", Logger.Severities.Debug);
                        setTimeout(()=>{
                            this.prepareForDispense(callback, height)
                        },1000)
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 4 Dispensado artículo desde cinta", Logger.Severities.Debug);
                        setTimeout(()=>{
                            this.dispense(piso,c1,c2,callback)
                        },1000)
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 5 Bajando elevador para realizar entrega", Logger.Severities.Debug);
                        this.stateMachine.receivingItem= false;
                        this.stateMachine.isDelivery=true;
                        setTimeout(()=>{
                            this.GoTo(callback,7);
                        },1000)
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 6 Esperando evento del retiro del articulo", Logger.Severities.Debug);
                        this.emit("Event",{cmd:"Ok_dispensing", data:true});
                        setTimeout(()=>{
                            this.waitForRemoveItem(callback)
                        },2000)
                    },
                    (callback:any)=>{
                        this.Log.WriteLog("Step 7 Asegurando puerta", Logger.Severities.Debug);
                        setTimeout(()=>{
                            this.gotoInitPosition(callback)
                        },8000)
                    }
                ],(result?:any)=> {
                    this.stateMachine.isDispense = false;
                    this.stateMachine.readyForDispense = true;
                    if(result == null) {
                        this.stateMachine.blokingType = 0;
                        this.stateMachine.attempts = 0;
                        this.Log.WriteLog('Proceso de Venta Completado', Logger.Severities.Debug);
                        callback(result);
                    }else{
                        this.Log.WriteLog("Error: "+result, Logger.Severities.Alert);
                        this.gotoInitPosition((err:any)=>{
                            if(err){
                                this.Log.WriteLog(err, Logger.Severities.Error);
                            }
                        });
                        callback(result);
                    }
                })
        }else{
            this.emit("Event",{cmd:"Falla"});
            callback("Máquina deshabilitada por falla en sensores")
        }
    };
    //Ubicar el elevador en la posición inicial
    private gotoInitPosition=(callback:any)=>{
        this.stateMachine.findProcess = false;
        this.Log.WriteLog("InitPos - Elevador va a posición inicial", Logger.Severities.Debug);
        if(this.stateMachine.initPosition == true){
            this.Log.WriteLog("InitPos - El elevador se encuentra en la posición inicial", Logger.Severities.Debug);
            callback(null)
        }else{
            _async.series([
                //Step 1 - Ubicando elevador en posicion 7
                (callback:any)=>{
                    this.Log.WriteLog("InitPos - Ubicando elevador en la parte inferior, piso 7", Logger.Severities.Debug);
                    setTimeout(() => {
                        this.GoTo(callback,7);
                    }, 500)
                },
                //Step 2 - Ajustando altura de Elevador
                (callback:any)=>{
                    this.Log.WriteLog("InitPos - Ajustando altura para bloqueo de puerta principal", Logger.Severities.Debug);
                    setTimeout(() => {
                        this.motorStartUp();
                        setTimeout(() => {
                            this.motorStop();
                            this.securityState(true);
                            callback(null)
                        }, 400)
                    }, 500)
                }
            ],(result?:any)=> {
                if(result == null) {
                    this.Log.WriteLog("InitPos - Elevador ubicado en posición inicial", Logger.Severities.Debug);
                    this.securityState(true);
                    this.stateMachine.blokingType = 0;
                    this.stateMachine.attempts = 0;
                    this.stateMachine.initPosition = true;
                    callback(null);
                } else{
                    this.Log.WriteLog("Error ubicando en la posición inicial", Logger.Severities.Alert);
                    callback(result);
                }
            })
        }
    };
    //Beta de dispensar;
    private dispense=(piso:number, coll_1:number, coll_2:any,callback: any)=> {
        let row = Config.row[piso].PIN;
        let c1 = Config.column[coll_1].PIN;
        let c2 = (coll_2 != null) ? Config.column[coll_2].PIN : null;
        this.Log.WriteLog("Iniciando Dispensado desde piso "+piso+" columna-1: "+c1+" columna-2 "+c2, Logger.Severities.Debug);
        this.motorCintaStart(row, c1, c2);
        this.stateMachine.receivingItem= true;
        let countTime = 100;
        let wait:any = setInterval(()=>{
            countTime+=100;
            //Si se excede del tiempo estimado
            if(countTime>10000){
                this.Log.WriteLog("Exceso de tiempo dispensando, countTime: "+countTime, Logger.Severities.Debug);
                this.motorCintaStop(row, c1, c2);
                callback("Tiempo excedido dispensando artículo");
                clearInterval(wait);
                wait=null;
            }
            //Lee el sensor para leer llegada del producto
            this.pollSensor(Config.Sensor[piso].PIN,(err:any, value:boolean)=>{
                //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                if(value == true){
                    this.emit("Item recibido",this.stateMachine.location,value);
                }
            })
        },200);
        this.once("Item recibido",()=>{
            this.motorCintaStop(row, c1, c2);
            this.stateMachine.receivingItem=false;
            callback(null);
            clearInterval(wait);
            wait=null;
        })
    };
    //Controla el tiempo de avance del motor
    private controlTime=(callback:any)=>{
        //Espera la posición de destino
        let nPisos:number;
        let ready:boolean = false;
        this.stateMachine.countTime = 100;
        nPisos = (this.stateMachine.location!=null)?this.stateMachine.location - this.stateMachine.goingTo:4;
        let time = 0;
        nPisos = (nPisos<0)? nPisos * -1:nPisos;
        time = nPisos * 2700;
        this.Log.WriteLog("Se movera "+nPisos+ " en un tiempo límite para llegar a destino es "+time, Logger.Severities.Debug);
        this.stateMachine.blokingType = 0;
        //Espera la posición de destino
        let wait:any = setInterval(()=>{
            this.stateMachine.countTime+=100;
            //Si llego sin problemas en el tiempo estimado
            if(this.checkPosition(this.stateMachine.goingTo)){
                this.Log.WriteLog("Elevador llego por lectura de evento en: "+this.stateMachine.countTime+" ms", Logger.Severities.Debug);
                ready = true;
            }
            //Lee el estado del sensor del piso destino
            if(this.stateMachine.goingTo!=0){
                this.pollSensor(
                    Config.Sensor[this.stateMachine.goingTo].PIN,
                    (err:any, value:boolean)=>{
                        if(value == true){
                            this.stateMachine.timeWithoutSensor = 100;
                            ready = true;
                            this.Log.WriteLog("Elevador llego por lectura de sensor en: "+this.stateMachine.countTime+" ms", Logger.Severities.Debug);
                        }
                    });
            }
            if(ready == true){
                this.stateMachine.blokingType=0;
                this.stateMachine.attempts=0;
                this.stateMachine.countTime = 0;
                clearInterval(wait);
                wait=null;
                callback(null);
            }
            //Si se excede del tiempo estimado
            if(this.stateMachine.countTime>time){
                this.Log.WriteLog("Leyendo posible atasco, countTime: "+this.stateMachine.countTime, Logger.Severities.Debug);
                //Si es subiendo - Bloqueo en proceso de dispensa subiendo y se paso del tiempo de posición
                if(this.stateMachine.motorState == 1 && this.stateMachine.isDispense == true) {
                    this.stateMachine.blokingType = 3;
                }
                //Si es bajando - Bloqueo en proceso de dispensa bajando y se paso del tiempo de posición
                if(this.stateMachine.motorState == 2 && this.stateMachine.isDispense == true){
                    this.stateMachine.blokingType = 2;
                }
                callback("Bloqueo");
                clearInterval(wait);
                wait=null;
            }
            //Si está definido un tipo de bloqueo
            if(this.stateMachine.blokingType!=0){
                callback("Bloqueo");
                clearInterval(wait);
                wait=null;
            }
        },100)
    };
    //Controla intentos de desatascos del elevador
    private controlBlocking=(callback:any)=>{
        this.stateMachine.attempts++;
        this.Log.WriteLog("Intentos "+this.stateMachine.attempts, Logger.Severities.Debug);
        this.securityState(false);
        if(this.stateMachine.attempts>2){
            this.Log.WriteLog("Elevador bloqueado luego de 2 intentos - Se requiere revisión", Logger.Severities.Critical);
            //callback("Elevador bloqueado luego de 2 intentos - Se requiere revisión")
            this.disableMachine();
        }else{
            this.Log.WriteLog("Comenzando proceso de desbloqueo número: "+this.stateMachine.attempts, Logger.Severities.Debug);
            this.Log.WriteLog("Intento de desbloqueo de tipo: "+this.stateMachine.blokingType, Logger.Severities.Alert);
            switch (this.stateMachine.blokingType) {
                //Listo - Probar
                case 1: //Arranca y no detecta sensores y no se encuentra
                    this.stateMachine.location = null;
                    this.Log.WriteLog("Step 1 - Reiniciando sensores", Logger.Severities.Alert);
                    this.resetSensors((err:any)=>{
                        if (err){
                            callback("No se pudo recuperar sensores")
                        }else {
                            this.Log.WriteLog("Step 2 - Buscando elevador", Logger.Severities.Alert);
                            this.findElevator((err:any) => {
                                if (err){
                                    callback("Imposible conseguir el elevador");
                                    this.disableMachine();
                                }else {
                                    callback(null)
                                }
                            })
                        }
                    });
                    break;
                //Listo - Probar
                case 2: //Atasco del elevador luego de recibir artículo
                    this.motorStop();
                    this.stateMachine.enableMachine = false;
                    this.disableMachine();
                    callback("Se detectó un atasco al bajar para entregar - La máquina está deshabilitada por seguridad");
                    break;
                //Listo - Probado
                case 3://Atasco yendo a buscar un artículo, se detiene y resume el proceso
                    this.motorStop();
                    this.Log.WriteLog("Step 1 - Bajando para desatascar", Logger.Severities.Debug);
                    this.motorStartDown();
                    setTimeout(()=>{
                        this.motorStop();
                        this.Log.WriteLog("Step 1 - Resumiendo proceso de dispensa", Logger.Severities.Debug);
                        setTimeout(()=>{
                            callback(null)
                        },1500)
                    },300);
                    break;
                //Listo - Probado
                case 4://Se detecta un evento inesperado en los sensores
                    this.stateMachine.isDelivery=false;
                    this.stateMachine.enableMachine = false;
                    this.motorStop();
                    setTimeout(()=>{
                        this.gotoInitPosition((err:any) => {
                            this.disableMachine();
                            if(err==null){
                                this.Log.WriteLog("Elevador ubicado en posicion inicial por seguridad", Logger.Severities.Alert);
                                this.stateMachine.attempts = 0;
                                callback(null);
                            }else{
                                this.Log.WriteLog("Maquina deshabilitada, no se pudo estabilizar", Logger.Severities.Alert);
                            }
                        })
                    },1000);
                    break;
                //Listo - Probar
                case 5: //Si pasó de posición
                    this.motorStop();
                    this.Log.WriteLog("Step 1 - Reseteando sensores", Logger.Severities.Alert);
                    this.resetSensors((err:any)=>{
                        if (err){
                            callback("No se pudo recuperar sensores")
                        }else{
                            this.Log.WriteLog("Step 2 - ubicando elevador en posición inicial", Logger.Severities.Alert);
                            this.stateMachine.location = null;
                            this.findElevator((err:any) => {
                                if (err!=null){
                                    this.disableMachine();
                                    callback("No se pudo encontrar el elevador");
                                }else{
                                    this.GoTo((err:any)=>{
                                        callback(err)
                                    },this.stateMachine.goingTo)
                                }
                            })
                        }
                    });
                    break
            }
        }
    };
    //Leer pin de entrada Gpio
    public pollSensor=(pin: number, callback:any)=>{
        Gpio.read(pin,(err:any, value?:any)=>{
            if(err){
                this.Log.WriteLog("Error leyendo el pin "+pin, Logger.Severities.Error);
                this.Log.WriteLog(err, Logger.Severities.Error);
                callback(err)
            }else{
                if(value==true){
                    this.Log.WriteLog("Leyendo pin "+pin+" en estado "+value, Logger.Severities.Debug);
                    callback(null, value)
                }
            }
        })
    };
    //Leer pines de entrada Gpio
    private pollAllSensors=(callback:any)=>{
        for (let i = 1; i < 8; i++) {
            this.pollSensor(Config.Sensor[i].PIN, (err: any, value: any) => {
                this.Log.WriteLog("Check pin de piso " + i + " - valor: " + value,Logger.Severities.Debug);
                this.stateMachine.location = (value == true && this.stateMachine.findProcess == true)? i:null;
                if(err!=null){
                    callback("Error leyendo pin "+Config.Sensor[i].PIN+" del piso "+i)
                }
            })
        }
        callback(null)
    };
    //Habilitar y deshabilitar maquina
    private enableMachine=()=>{
        this.stateMachine.enableMachine = true;
        this.Log.WriteLog("Máquina habilitada", Logger.Severities.Debug);
        this.emit("Event",{cmd:"Enable_Machine"})
    };
    private disableMachine=()=>{
        this.stateMachine.enableMachine = false;
        this.Log.WriteLog("Máquina deshabilitada", Logger.Severities.Debug);
        this.emit("Event",{cmd:"Disable_Machine"})
    };

    //Test celdas
    public testCeldas=(piso:number, coll_1:number, coll_2:any,callback:any)=> {
        let row = Config.row[piso].PIN;
        let c1 = Config.column[coll_1].PIN;
        let c2 = (coll_2 != null) ? Config.column[coll_2].PIN : null;
        this.Log.WriteLog("Iniciando test de celda", Logger.Severities.Debug);
        this.motorCintaStart(row, c1, c2);
        setTimeout(()=>{
            this.motorCintaStop(row, c1, c2);
            console.log("Test de celda finalizado");
            callback(null);
        },4000)
    };
    //Test de pines de salida
    public testPinOut=(mcp:number, pin:number,callback:any)=> {
        this.Log.WriteLog("Iniciando test de pin de salida "+pin, Logger.Severities.Debug);
        try{
            switch (mcp) {
                case 1:
                    this.Log.WriteLog("Encendiendo pin "+pin+" de MCP1", Logger.Severities.Debug);
                    this.mcp1.digitalWrite(pin, this.mcp1.HIGH);
                    setTimeout(()=>{
                        this.mcp1.digitalWrite(pin, this.mcp1.LOW);
                        console.log("Test de celda finalizado");
                        callback(null);
                    },3000);
                    break;
                case 2:
                    this.Log.WriteLog("Encendiendo pin "+pin+" de MCP2", Logger.Severities.Debug);
                    this.mcp2.digitalWrite(pin, this.mcp2.HIGH);
                    setTimeout(()=>{
                        this.mcp2.digitalWrite(pin, this.mcp2.LOW);
                        console.log("Test de celda finalizado");
                        callback(null);
                    },3000);
                    break;
            }
        }catch (e) {
            callback(e)
        }
    };

    //Version 8.0 Lite
    //Mantener la puerta cerrada al momento de iniciar la lógica
    //Solo abrir la puerta cuando se esta en modo administración
}