import Maps from './Maps';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import Event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async from "async";
import {Logger} from "ci-syslogs";
import {Sensor} from "./Sensor";
import global from'./Global';

export class ControllerMachine extends Event{
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
        readSensor      : false,    //Controla la lectura de un sensor dentro de un límite de tiempo
        findProcess     : false     //Indica que la máquina se encuentra en proceso de búsqueda
    }
    //Proceso de dispensa actual
    private currentProcess: any = {
        piso: null,
        c1: null,
        c2: null,
        height: null
    }
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

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.mainSignal);
        this.initOuts();
        this.initSensors((err:any)=>{
            if(err){
                this.Log.LogError(err);
            }
        });
        this.stateMachine.sensorPiso = new Sensor();
        this.Log.LogDebug("chequeando serial");
        this.stateMachine.enableMachine=true;// Modo prueba
        setTimeout(()=>{
            if(this.stateMachine.sensorPiso.isCheck==true){
                this.Log.LogDebug("Máquina habilitada");
                this.stateMachine.enableMachine=true;
                this.securityState(false);
                this.emit("Event",{cmd:"Maquina_Lista"})
                if(this.stateMachine.location==null){
                    this.findElevator((cb:any)=>{
                        this.Log.LogDebug("Fin de proceso de busqueda de elevador")
                        setTimeout(()=>{
                            this.gotoInitPosition((err:any)=>{
                                if (err!=null){
                                    this.Log.LogDebug(err)
                                }
                            })
                        },1000)
                    });
                }
            }else{
                //this.emit("Event",{cmd:"Error_puerto_serial"})
            }
        },5000)
    }
    //Habilita o deshabilita seguridad
    private securityState=(state:boolean)=>{
        this.stateMachine.securityMachine=state;
        this.Log.LogDebug("La seguridad esta en: "+state);
    }
    //Inicializa salidas
    private initOuts= ():void=> {
            this.Log.LogDebug("Inicializando salidas");
            for (let i = 0; i < 16; i++) {
                try{
                    this.mcp1.pinMode(i, this.mcp1.OUTPUT);
                    this.Log.LogDebug("Pin "+i+" de MPC1 Inicializado");
                }catch (e) {
                    this.Log.LogError("Error al inicializar Pin: "+i+ " de MCP1");
                }
                try{
                    this.mcp2.pinMode(i, this.mcp2.OUTPUT);
                    this.Log.LogDebug("Pin "+i+" de MPC2 Inicializado");
                }catch (e) {
                    this.Log.LogError("Error al inicializar Pin: "+i+ " de MCP2");
                }
            }
        this.Log.LogDebug("Inicializacion exitosa");
    };
    //Inicializa sensores
    private initSensors= (callback:any):void =>{
        try {
            this.Log.LogDebug("Inicializando sensores");
            //----------Sensores----------//
            Gpio.setup(Maps.Sensor.S1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.S2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.S3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.S4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.S5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.S6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Sensor.SM.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(Maps.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(Maps.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(Maps.elevator.Up.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(Maps.elevator.Down.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(Maps.general.stop.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            this.Log.LogDebug("Sensores listos");
            callback(null)
        }catch(e) {
            this.Log.LogError("Error al iniciar los sensores de entrada");
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
                callback(null)
                this.Log.LogDebug('Sensores reiniciados '+result);
            } else{
                callback(result)
                this.Log.LogAlert("Error: "+result);
            }
        })
    }
    //Deshabilita todos los sensores
    public closeSensors= (callback:any):void=> {
        try {
            Gpio.destroy((err:any)=>{
                this.Log.LogDebug("Sensores deshabilidatos");
                callback(err)
            });
        }catch(e) {
            this.Log.LogError(e.stack+"Error detener sensores  ");
            callback(e);
        }
    };
    //Detiene todos los pines de salida
    public stopAll=()=>{
        this.Log.LogDebug("Deteniendo toda la máquina");
        for (let i = 0; i < 16; i++) {
            try{
                this.mcp1.digitalWrite(i, this.mcp1.LOW);
                this.Log.LogDebug("Pin "+i+" de MPC1 Detenido");
            }catch (e) {
                this.Log.LogError("Error al detener Pin: "+i+ " de MCP1");
            }
            try{
                this.mcp2.digitalWrite(i, this.mcp2.LOW);
                this.Log.LogDebug("Pin "+i+" de MPC2 Detenido");
            }catch (e) {
                this.Log.LogError("Error al detener Pin: "+i+ " de MCP2");
            }
        }
    }
    //Busca la posición del elevador si no está establecida
    private findElevator=(callback:any):void=>{
        this.stateMachine.findProcess = true
        //Proceso de busqueda de elevador
        if(this.stateMachine.location == null){
            this.once("Sensor",(piso, state)=>{
                if(state == true){
                    this.motorStop();
                    this.Log.LogDebug("Deteccion de elevador en: "+piso);
                    clearImmediate(timeUp)//Probar
                    clearTimeout(timeUp)
                    timeUp = null
                    this.stateMachine.location=piso;
                    callback(null)
                }
            })
            this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
            this.motorStartUp();
            //Mueve el elevador para conseguir ubicación
            let timeUp:any = setTimeout(()=>{
                this.motorStop();
                if(this.stateMachine.location == null){
                    this.motorStartDown()
                    setTimeout(()=>{
                        if(this.stateMachine.location == null){
                            this.Log.LogAlert("Elevador no pudo ser encontrado");
                            this.stateMachine.blokingType = 1
                            this.motorStop();
                            this.controlBlocking(callback);
                        }else{
                            this.Log.LogDebug("Elevador encontrado bajando en el piso: "+this.stateMachine.location);
                            this.gotoInitPosition(callback)
                        }
                        this.motorStop();
                    },2500)
                }else{
                    this.gotoInitPosition(callback)
                }
            },2500)
        }else{
            this.Log.LogDebug("Elevador encontrado en el piso: "+this.stateMachine.location);
            this.stateMachine.findProcess = false
            callback(null)
        }
    }
    //Chequea posición del elevador según parámetro
    private checkPosition=(pos: number):boolean=>{
        if(this.stateMachine.location==pos){
            return true
        }else{
            return false;
        }
    }
    //Enciende el motor del elevador hacia abajo
    public motorStartDown= () =>{
        try {
            if(this.checkPosition(Maps.row.M.Piso)){
                this.Log.LogDebug("El Elevador está al limite inferior, no puede bajar mas");
            }else{
                this.mcp2.digitalWrite(Maps.MCP_Motor.Down.value, this.mcp2.HIGH);
                this.stateMachine.motorState = 2;
                this.Log.LogDebug("Elevador Bajando");
            }
        }catch(e) {
            this.Log.LogError("Error al bajar ascensor"+e.stack);
        }
    };
    //Enciende el motor del elevador hacia arriba
    public motorStartUp= () =>{
        try {
            if(this.checkPosition(Maps.row.A.Piso)){
                this.Log.LogDebug("El Elevador está al limite superior, no puede subir mas");
            }else{
                this.mcp2.digitalWrite(Maps.MCP_Motor.UP.value, this.mcp2.HIGH);
                this.stateMachine.motorState = 1;
                this.Log.LogDebug("Elevador subiendo");
            }
        }catch(e) {
            this.Log.LogError("Error al subir ascensor"+e.stack);
        }
    };
    //Detiene el motor del elevador
    public motorStop= () =>{
        try {
            this.mcp2.digitalWrite(Maps.MCP_Motor.Down.value, this.mcp2.LOW);
            this.mcp2.digitalWrite(Maps.MCP_Motor.UP.value, this.mcp2.LOW);
            this.stateMachine.motorState = 0;
            this.Log.LogDebug("Elevador detenido");
            this.stateMachine.goingTo=0;
        }catch(e) {
            this.Log.LogError("Error al detener ascensor"+e.stack);
        }
    };
    //Inicia el motor de una cinta específica
    public motorCintaStart= (row: number, coll:number, coll2:number) =>{
        try {
            _async.parallel([()=>{
                this.Log.LogDebug("Activando pin fila: "+row)
                this.mcp1.digitalWrite(Number(row), this.mcp1.HIGH);
            },()=>{
                this.Log.LogDebug("Activando pin columna: "+coll)
                this.mcp1.digitalWrite(Number(coll), this.mcp1.HIGH);
            },()=>{
                if(coll2!=null){
                    this.Log.LogDebug("Activando pin columna: "+coll2)
                    this.mcp1.digitalWrite(Number(coll2), this.mcp1.HIGH);
                }
            }])
            this.Log.LogDebug("Motor de celda activado");
        }catch(e) {
            this.Log.LogError("Error al activar celda"+e.stack);
        }
    };
    //Detiene el motor de una cinta específica
    public motorCintaStop= (row: number, coll:number, coll2:number) =>{
        try {
            _async.parallel([()=>{
                this.mcp1.digitalWrite(Number(row), this.mcp1.LOW);
            },()=>{
                this.mcp1.digitalWrite(Number(coll), this.mcp1.LOW);
            },()=>{
                if(coll2!=null){
                    this.mcp1.digitalWrite(Number(coll2), this.mcp1.LOW);
                }
            }])
            this.Log.LogDebug("Motor de celda detenido");
        }catch(e) {
            this.Log.LogError("Error al activar celda"+e.stack);
        }
    };
    //Emite alerta de seguridad
    private emitSecurityAlert= (msg: string)=>{
        this.Log.LogAlert("Alerta, de seguridad: "+msg)
        this.emit("Event",{cmd:"Alerta"})
    }
    //Controla acciones de según señales de sensores
    private controlSensors=(piso:number,pin:number, state:boolean)=>{
        this.stateMachine.readSensor = true
        //Se emite la alerta si se activa un sensor cuando esta activa el estado de seguridad
        if(this.stateMachine.securityMachine==true && pin!=Maps.elevator.Up.PIN && pin!=Maps.elevator.Down.PIN){
            this.emitSecurityAlert("sensor activado cuando la máquina está inactiva pin: "+pin)
            this.gotoInitPosition((err:any)=>{
                if(err!=null){
                    this.Log.LogAlert("Puerta asegurada por alerta de seguridad: "+pin)
                }
            });
        }
        //Acciones cuando se activa o desactiva un sensor
        if (state === true) {
            this.Log.LogDebug("Sensor de piso "+piso+" On");
            //Alertas de seguridad por activaciones de sensor inesperados
            switch (this.stateMachine.motorState) {
                case 0:
                    //Emite Alerta si se activa un sensor en espera por retiro del producto
                    if(this.stateMachine.isDelivery == true && piso<Maps.row.M.Piso && piso!=this.stateMachine.location){
                        this.emitSecurityAlert("sensor activado del piso "+piso+" cuando se espera por retiro del producto")
                        this.gotoInitPosition(()=>{
                            this.Log.LogAlert("Puerta asegurada por evento inesperado mientras se retiraba el producto")
                        })
                    }
                    //Emite el evento de entrega del articulo en el elevador si y solo si esta habilitado el estado y el motor está detenido
                    if(this.stateMachine.receivingItem == true && this.stateMachine.location == piso){
                        this.emit("Item recibido",this.stateMachine.location,state);
                    }
                    break
                case 1:
                    //Actualiza ubicación del elevador
                    if(this.stateMachine.securityMachine == false && this.stateMachine.location>piso){
                            this.Log.LogDebug("El elevador está en el piso: "+piso);
                            this.stateMachine.location = piso
                    }else {
                        if (this.stateMachine.findProcess == false) {
                            this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en subida")
                            this.stateMachine.blokingType = 4
                        }
                    }
                    if(piso<this.stateMachine.goingTo){
                        this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición "+this.stateMachine.goingTo)
                        this.stateMachine.blokingType = 4
                    }
                    break
                case 2:
                    //Actualiza ubicación del elevador
                    if(this.stateMachine.securityMachine == false && this.stateMachine.location<piso){
                        this.Log.LogDebug("El elevador está en el piso: "+piso);
                        this.stateMachine.location = piso
                    }else{
                        if(this.stateMachine.findProcess==false) {
                            this.emitSecurityAlert("sensor activado del piso " + piso + " no debió activarse en bajada")
                            this.stateMachine.blokingType = 4
                        }
                    }
                    if(piso>this.stateMachine.goingTo){
                        this.emitSecurityAlert("sensor activado del piso " + piso + " se paso de posición "+this.stateMachine.goingTo)
                        this.stateMachine.blokingType = 4
                    }
                    break
            }
            //Detecta que el elevador llego a la posición deseada
            if(this.stateMachine.goingTo == this.stateMachine.location){
                //Si se dirige a hacer una entrega, baja un poco más
                if(this.stateMachine.isDelivery==true && this.stateMachine.goingTo == 7){
                    this.Log.LogDebug("Bajando el elevador para retirar el producto");
                    setTimeout(()=>{
                        this.motorStop();
                    },300)
                }else{
                    this.motorStop();
                }
            }
        } else {
            this.Log.LogDebug("Sensor de piso "+piso+" Off");
        }
        this.emit("Sensor",this.stateMachine.location,state);
    }
    //Control de mandos de controladora
    private manualController = (pin:number, state:boolean)=>{
        if (state === false) {
            this.securityState(false)
            switch (pin) {
                case Maps.elevator.Up.PIN:
                    this.Log.LogDebug("Elevador subiendo de forma manual");
                    this.mcp2.digitalWrite(Maps.MCP_Motor.UP.value, this.mcp2.HIGH);
                    this.stateMachine.motorState = 1
                    break
                case Maps.elevator.Down.PIN:
                    this.Log.LogDebug("Elevador bajando de forma manual");
                    this.mcp2.digitalWrite(Maps.MCP_Motor.Down.value, this.mcp2.HIGH);
                    this.stateMachine.motorState = 2
                    break
            }
        } else {
            this.Log.LogDebug("Elevador se detuvo de forma manual");
            this.motorStop()
            this.securityState(true)
        }
    }
    //Recibe señal de entrada y determina de donde proviene
    private mainSignal=(pin:number,state:boolean)=>{
            switch (pin) {
                case Maps.Sensor.S1.PIN:
                    this.controlSensors(1,pin,state);
                    break;
                case Maps.Sensor.S2.PIN:
                    this.controlSensors(2,pin,state);
                    break;
                case Maps.Sensor.S3.PIN:
                    this.controlSensors(3,pin,state);
                    break;
                case Maps.Sensor.S4.PIN:
                    this.controlSensors(4,pin,state);
                    break;
                case Maps.Sensor.S5.PIN:
                    this.controlSensors(5,pin,state);
                    break;
                case Maps.Sensor.S6.PIN:
                    this.controlSensors(6,pin,state);
                    break;
                case Maps.Sensor.SM.PIN:
                    this.controlSensors(7,pin,state);
                    break;
                case Maps.Pulso.P1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 1");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 1");
                    }
                    break;
                case Maps.Pulso.P2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 2");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 2");
                    }
                    break;
                case Maps.Pulso.P3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 3");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 3");
                    }
                    break;
                case Maps.Pulso.P4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 4");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 4");
                    }
                    break;
                case Maps.Pulso.P5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 5");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 5");
                    }
                    break;
                case Maps.Pulso.P6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 6");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 6");
                    }
                    break;
                case Maps.Aux.A1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor Aux A1");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor Aux A1");
                    }
                    break;
                case Maps.Aux.A2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor Aux A2");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor Aux A2");
                    }
                    break;
                case Maps.Card.Int.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso Card In On");
                    } else {
                        this.Log.LogDebug("Pulso Card In Off");
                    }
                    break;
                case Maps.Card.Out.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso Card Out On");
                    } else {
                        this.Log.LogDebug("Pulso Card Out Off");
                    }
                    break;
                case Maps.elevator.Up.PIN:
                    this.manualController(Maps.elevator.Up.PIN, state)
                    break;
                case Maps.elevator.Down.PIN:
                    this.manualController(Maps.elevator.Down.PIN, state)
                    break;
                case Maps.general.stop.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador se detuvo??");
                    } else {
                        this.Log.LogDebug("Elevador se mueve??");
                    }
            }
    }
    //Enviar el elevador a una fila específica con control de atascos
    public GoTo=(callback:any,row:number)=>{
        this.securityState(false);
        this.Log.LogDebug("Elevador se dirige a la posición: "+row)
        this.stateMachine.goingTo = row;
        if(this.stateMachine.location==row){
            this.Log.LogDebug("El elevador esta en posición");
            callback(null);
        }else{
            if(this.stateMachine.location>row){
                this.motorStartUp();
            }else if(this.stateMachine.location<row){
                this.motorStartDown();
            }
            this.stateMachine.initPosition = false;
            //Espera la posición de destino y verifica atascos
            this.controlTime(callback);
        }
    }
    //Prepara y ajusta posición del elevador para recibir artículo
    private prepareForDispense=(callback: any, height:number)=> {
        let timeForDown = height * 13;
        if (this.checkPosition(this.stateMachine.location)) {
            this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
            this.motorStartDown();
            setTimeout(() => {
                this.motorStop();
                this.Log.LogDebug("Elevador ubicado y listo para recibir");
                this.stateMachine.receivingItem= true;
                callback(null)
            }, timeForDown)
        } else {
            this.Log.LogError("El elevador no está en posición para recibir");
        }
    }
    //Tiempo de espera para que el cliente retire el producto
    private waitForRemoveItem=(callback:any)=>{
        if(global.Is_empty == false){
            this.Log.LogDebug("Hay un producto en el elevador para retirar")
            let wait:any = setInterval(()=>{
                if (global.Is_empty == true){
                    callback(null)
                    clearInterval(wait)
                    wait=null;
                }
            },500)
        }else{
            this.Log.LogDebug("No Hay producto en el elevador, se ajustará en 30s")
            setTimeout(()=>{
                callback(null)
            },22000)
        }
    }
    //Proceso completo para dispensar artículo al cliente
    public dispenseItem=(piso: number, c1:number,c2:number|null, height: number, callback:callback)=>{
        this.stateMachine.isDispense = true
        this.Log.LogDebug("Comenzando proceso de dispensar item en el piso "+piso);
        //Almacenando datos del proceso actual
        this.currentProcess.piso = piso
        this.currentProcess.c1 = c1
        this.currentProcess.c2 = c2
        this.currentProcess.height = height
        this.securityState(false)
        if(this.stateMachine.enableMachine){
                this.Log.LogDebug("Comenzando proceso de dispensar item");
                _async.series([
                    (callback:any)=>{
                        this.Log.LogDebug("Step 0 Reiniciando sensores");
                        this.resetSensors(callback)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 1 Verificando posición de elevador");
                        if(this.checkPosition(7)){
                            callback(null)
                        }else{
                            this.findElevator(callback);
                        }
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 2 Ubicando elevador en posición");
                        this.GoTo(callback,piso);
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 3 Ajustando posición del elevador segun tamaño");
                        setTimeout(()=>{
                            this.prepareForDispense(callback, height)
                        },1000)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 4 Dispensado artículo desde cinta");
                        setTimeout(()=>{
                            this.dispense(piso,c1,c2,callback)
                        },1000)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 5 Bajando elevador para realizar entrega");
                        this.stateMachine.receivingItem= false;
                        this.stateMachine.isDelivery=true;
                        this.GoTo(callback,7);
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 6 Esperando evento del retiro del articulo");
                        this.emit("Event",{cmd:"Ok_dispensing", data:true})
                        setTimeout(()=>{
                            this.waitForRemoveItem(callback)
                        },2000)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 7 Asegurando puerta");
                        setTimeout(()=>{
                            this.gotoInitPosition(callback)
                        },8000)
                    }
                ],(result?:any)=> {
                    this.stateMachine.isDispense = false
                    if(result == null) {
                        this.stateMachine.blokingType = 0
                        this.stateMachine.attempts = 0
                        this.Log.LogDebug('Proceso de venta completo '+result);
                        this.currentProcess.piso = null
                        this.currentProcess.c1 = null
                        this.currentProcess.c2 = null
                        this.currentProcess.height = null
                        callback(result);
                    } else{
                        this.Log.LogAlert("Error: "+result);
                        callback(result);
                    }
                })
        }else{
            callback("Máquina deshabilitada por falla en sensor serial")
        }
    }
    //Obtiene los pines de los motores de las celdas
    private findRow= (row: number, col_1:number,col_2:number|null, callback:any) =>{
        this.Log.LogDebug("Buscando pines");
        let coll:number;
        let coll2:any=null;
        let r:number;
        try {
            _async.mapSeries(global.MCP_Columna,
                (Columna:any,cb:callback)=>{
                    if(Columna.ID.toString()==col_1){
                        coll=Columna.value;
                    }
                    cb(null);
                },(err:any,data?:any)=>{
                    _async.mapSeries(global.MCP_Columna,
                        (Columna:any,cb:callback)=>{
                        if(Columna.ID.toString()==col_2){
                            coll2=Columna.value;
                        }
                        cb(null);
                    },(err:any,data?:any)=>{
                        _async.mapSeries(global.MCP_row,
                            (Row:any,cb:callback)=>{
                            if(Row.ID.toString()==row){
                                r=Row.value;
                            }
                            cb(null);
                        },(err:any,data?:any)=>{
                            callback(null, r, coll, coll2);
                        });
                    });
                });
        }catch(e) {
            this.Log.LogError(e.stack+'error seleccionando columna' );
        }
    }
    //Ubicar el elevador en la posición inicial
    private gotoInitPosition=(callback:any)=>{
        this.stateMachine.findProcess = false
        this.Log.LogDebug("InitPos - Elevador va a posición inicial");
        if(this.stateMachine.initPosition == true){
            this.Log.LogDebug("InitPos - El elevador se encuentra en la posición inicial");
            callback(null)
        }else{
            _async.series([
                //Step 1 - Ubicando elevador en posicion 7
                (callback:any)=>{
                    this.Log.LogDebug("InitPos - Ubicando elevador en la parte inferior, piso 7")
                    setTimeout(() => {
                        this.GoTo(callback,7);
                    }, 500)
                },
                //Step 2 - Ajustando altura de Elevador
                (callback:any)=>{
                    this.Log.LogDebug("InitPos - Ajustando altura para bloqueo de puerta principal")
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
                    this.Log.LogDebug("InitPos - Elevador ubicado en posición inicial");
                    this.securityState(true)
                    this.stateMachine.blokingType = 0
                    this.stateMachine.attempts = 0
                    this.stateMachine.initPosition = true
                    callback(null);
                } else{
                    this.Log.LogAlert("Error ubicando en la posición inicial");
                    callback(result);
                }
            })
        }
    }
    //Beta de dispensar
    private dispense=(piso:number, coll_1:number, coll_2:any,callback: any)=> {
        this.findRow(piso, coll_1,coll_2,(err:any,row:any,c1:any,c2:any )=>{
            this.Log.LogDebug("Dispensando desde piso "+piso+" columna 1: "+c1+" columna 2 "+c2)
            this.Log.LogDebug("Dispensado artículo desde cinta");
            this.motorCintaStart(row, c1, c2);
            this.stateMachine.receivingItem= true;
            this.once("Item recibido",()=>{
                this.motorCintaStop(row, coll_1, coll_2);
                this.stateMachine.receivingItem=false;
                callback(null);
            })
        })
    }
    //Controla el tiempo de avance del motor
    private controlTime=(callback:any)=>{
        //Espera la posición de destino
        let nPisos:number = 0;
        this.stateMachine.readSensor = false;
        if(this.stateMachine.location!=null){
            nPisos = this.stateMachine.location - this.stateMachine.goingTo;
        }else{
            nPisos = 4
        }
        let time = 0;
        let countTime = 100;
        if(nPisos<0){
            nPisos = nPisos * -1;
        }
        time = nPisos * 1900;
        this.Log.LogDebug("Se movera "+nPisos+ " en un tiempo límite para llegar a destino es "+time)
        //Espera la posición de destino
        let wait:any = setInterval(()=>{
            countTime=countTime+100;
            //Si han pasado 4 segundos sin detectar ningun sensor
            if(countTime>4000 && this.stateMachine.readSensor == false){
                this.stateMachine.blokingType = 5
                this.controlBlocking(callback);
                clearInterval(wait)
                wait=null;
            }
            //Si la esta definido un tipo de bloqueo
            if(this.stateMachine.blokingType!=0){
                this.controlBlocking(callback);
                clearInterval(wait)
                wait=null;
            }
            //Si llego sin problemas en el tiempo estimado
            if(this.checkPosition(this.stateMachine.goingTo)){
                this.Log.LogDebug("Elevador llego en: "+countTime+" ms")
                this.stateMachine.blokingType=0
                this.stateMachine.attempts=0
                clearInterval(wait)
                wait=null;
                callback(null)
            }
            //Si se excede del tiempo estimado
            if(countTime>time){
                this.Log.LogDebug("Leyendo posible atasco, countTime: "+countTime)
                //Si es subiendo - Bloqueo en proceso de dispensa subiendo y se paso del tiempo de posición
                if(this.stateMachine.motorState == 1 && this.stateMachine.isDispense == true) {
                    this.stateMachine.blokingType = 3
                }
                //Si es bajando - Bloqueo en proceso de dispensa bajando y se paso del tiempo de posición
                if(this.stateMachine.motorState == 2 && this.stateMachine.isDispense == true){
                    this.stateMachine.blokingType = 2
                }
                this.controlBlocking(callback);
                clearInterval(wait)
                wait=null;
            }
        },100)
    }
    //Controla intentos de desatascos del elevador
    private controlBlocking=(callback:any)=>{
        this.stateMachine.attempts++
        this.securityState(false)
        if(this.stateMachine.attempts>2){
            this.Log.LogCritical("Elevador bloqeuado luego de 2 intentos - Se requiere revisión")
            callback("Elevador bloqueado luego de 2 intentos - Se requiere revisión")
        }else{
            this.Log.LogDebug("Comenzando proceso de desbloqueo número: "+this.stateMachine.attempts)
            switch (this.stateMachine.blokingType) {
                //Listo - Probar
                case 1: //Arranca y no detecta sensores y no se encuentra
                    this.Log.LogAlert("Intento de desbloqueo de tipo 1 :"+this.stateMachine.blokingType)
                    this.stateMachine.location = null
                    this.Log.LogAlert("Step 1 - Reiniciando sensores")
                    this.resetSensors((err:any)=>{
                        if (err){
                            callback("No se pudo recuperar sensores")
                        }else {
                            this.Log.LogAlert("Step 2 - Buscando elevador")
                            this.findElevator((err:any) => {
                                if (err){
                                    callback("Imposible conseguir el elevador")
                                }else {
                                    callback(null)
                                }
                            })
                        }
                    })
                    break
                //Listo - Probar
                case 2: //Atasco del elevador luego de recibir artículo
                    this.Log.LogAlert("Intento de desatasco de tipo 2: "+this.stateMachine.blokingType)
                    this.motorStop()
                    this.stateMachine.enableMachine = false
                    callback("Se detectó un atasco al bajar para entregar - La máquina está deshabilitada por seguridad")
                    break
                //Listo - Probado
                case 3://Atasco yendo a buscar un artículo, se detiene y resume el proceso
                    this.Log.LogAlert("Intento de desatasco de tipo 3 :"+this.stateMachine.blokingType)
                    this.motorStop()
                    this.Log.LogDebug("Step 1 - Bajando para desatascar")
                    this.motorStartDown()
                    setTimeout(()=>{
                        this.motorStop()
                        this.Log.LogDebug("Step 1 - Resumiendo proceso de dispensa")
                        setTimeout(()=>{
                            callback(null)
                        },1500)
                    },300)
                    break
                //Listo - Probar
                case 4://Se detecta un evento inesperado en los sensores
                    this.Log.LogAlert("Intento de desatasco de tipo 4 :"+this.stateMachine.blokingType)
                    this.stateMachine.isDelivery=false
                    this.motorStop()
                    setTimeout(()=>{
                        this.gotoInitPosition((err:any) => {
                            if(err){
                                this.Log.LogAlert("Maquina deshabilitada, no se pudo estabilizar")
                                this.stateMachine.enableMachine = false
                            }else{
                                this.Log.LogAlert("Elevador ubicado en posicion inicial por seguridad")
                                this.stateMachine.attempts = 0
                                this.stateMachine.blokingType = 0
                            }
                        })
                    },1000)
                    callback("Se detectó un evento inesperado - La máquina está deshabilitada por seguridad")
                    break
                //Listo - Probar
                case 5: //Si han pasado 4 segundos sin detectar ningun sensor cuando el motor está en movimiento
                    this.Log.LogAlert("Intento de desatasco de tipo 5 :"+this.stateMachine.blokingType)
                    this.motorStop()
                    this.Log.LogAlert("Step 1 - Reseteando sensores")
                    this.resetSensors((err:any)=>{
                        if (err){
                            callback("No se pudo recuperar sensores")
                        }else{
                            this.Log.LogAlert("Step 2 - Buscando elevador")
                            this.findElevator((err:any) => {
                                if (err){
                                    callback("Imposible conseguir el elevador")
                                }else {
                                    callback(null)
                                }
                            })
                        }
                    })
                    break
                //Listo - Probar
                case 6: //Si pasó de posición
                    this.Log.LogAlert("Intento de desatasco de tipo 6 :"+this.stateMachine.blokingType)
                    this.motorStop()
                    this.Log.LogAlert("Step 1 - Reseteando sensores")
                    this.resetSensors((err:any)=>{
                        if (err){
                            callback("No se pudo recuperar sensores")
                        }else{
                            this.Log.LogAlert("Step 2 - ubicando elevador en posición inicial")
                            this.gotoInitPosition((err:any) => {
                                if (err){
                                    callback("Imposible conseguir el elevador")
                                }else{
                                    callback(null)
                                }
                            })
                        }
                    })
                    break
            }
        }
    }

    //**************************Beta*******************************!//
    //Test celdas
    private testCeldas=(piso:number, coll_1:number, coll_2:number,callback: any)=> {
        this.findRow(piso, coll_1,coll_2,(err:any,row:any,c1:any,c2:any )=>{
            this.Log.LogDebug("Iniciando test de celda");
            this.motorCintaStart(row, c1, c2);
            setTimeout(()=>{
                this.motorCintaStop(row, c1, c2);
                console.log("Test de celda finalizado")
                callback(null);
            },4000)
        })
    }
    //Busqueda del elevador
    private findElevatorBeta=(callback:any):void=>{
        this.stateMachine.findProcess = true
        let timeUp:any
        //Proceso de busqueda de elevador
        if(this.stateMachine.location == null){
            this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
            _async.series([
                (callback:any)=>{
                    this.Log.LogDebug("Step 1 - Subiendo en búsqueda del elevador");
                    this.motorStartUp()
                    let count:number
                    timeUp = setInterval(()=>{
                        count = count + 100
                        if(this.stateMachine.location !=null){
                            this.motorStop()
                            callback(true) //Pendiente con esto
                            clearInterval(timeUp)
                            timeUp = null
                        }
                        if(count>3500){
                            this.motorStop()
                            callback(null) //Pendiente con esto
                            clearInterval(timeUp)
                            timeUp = null
                        }
                    },100)
                },
                (callback:any)=>{
                    this.Log.LogDebug("Step 2 - Bajando en búsqueda del elevador");
                    this.motorStartDown()
                    let count:number
                    timeUp = setInterval(()=>{
                        count = count + 100
                        if(this.stateMachine.location !=null){
                            this.motorStop()
                            callback(true) //Pendiente con esto
                            clearInterval(timeUp)
                            timeUp = null
                        }
                        if(count>3000){
                            this.motorStop()
                            callback(null)
                            clearInterval(timeUp)
                            timeUp = null
                        }
                    },100)
                },
            ],(error:any)=>{
                if (error == true){
                    this.Log.LogError("Elevador ubicado en "+ this.stateMachine.location)
                    this.gotoInitPosition(callback)
                }else{
                    this.Log.LogAlert("Elevador no pudo ser encontrado");
                    this.stateMachine.blokingType = 1
                    this.motorStop();
                    this.controlBlocking(callback);
                }
            })
        }else{
            this.Log.LogDebug("Elevador encontrado en el piso: "+this.stateMachine.location);
            this.stateMachine.findProcess = false
            callback(null)
        }
    }

    //Version 6.8
    //Probar dispensar con un articulo en el elevador // No funciona
    //Simular falla de sensores
    //Probar Validación de que se paso de piso //Listo
    //Alertas de sensores inesperados // Listo
    //Probar Reseteo de sensores en caso de atasco
    //Correccion en posicion inicial // Listo
    //Definir la habilitacion de la maquina luego de una recuperación

}