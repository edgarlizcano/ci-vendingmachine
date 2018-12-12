import Maps from './Maps';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import Event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async from "async";
import {Logger} from "ci-syslogs";
import _log from "@ci24/ci-logmodule";
import {Sensor} from "./Sensor";
import global from'./Global';
import {start} from "repl";

export class ControllerMachine extends Event{
    private Log = new Logger("0.0.0.0",Logger.Facilities.Machine);
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
    //Controla el destino del elevador al moverlo
    private goingTo: number = 0;
    //Controla el estado del motor. motorState: [0 stop, 1 going up, 2 going down]
    private motorState: number = 0;
    //Indica la posición actual del elevador
    private location:any = null;
    private sensorPiso:any;
    //motorState 1 up
    //motorState 2 down
    private receivingItem: boolean = false;
    private isDelivery: boolean = false;
    private enableMachine: boolean = false;
    //Estado de la máquina, si esta inactiva o en una operación
    private estatemachine: boolean = true;

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.signal);
        this.on("Sensor",(pin, state)=>{
            if(this.estatemachine==false && pin!=Maps.elevator.Up.PIN && pin!=Maps.elevator.Down.PIN){
                this.Log.LogAlert("Alerta, sensor activado cuando la máquina está inactiva")
                this.emit("Event",{cmd:"Alerta"})
            }
        })
        this.initOuts();
        this.initSensors();
        this.sensorPiso = new Sensor();
        this.Log.LogDebug("chequeando serial");
        setTimeout(()=>{
            if(this.sensorPiso.isCheck==true){
                this.Log.LogDebug("Máquina habilitada");
                this.enableMachine = true;
                this.emit("Event",{cmd:"Máquina Lista"})
                if(this.location==null){
                    this.findElevator((cb:any)=>{
                        this.Log.LogDebug("listo")
                    });
                }
            }else{
                this.emit("Event",{cmd:"Error al abrir puerto serial"})
            }
        },5000)
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
    private initSensors= ():void =>{
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
        }catch(e) {
            this.Log.LogError("Error al iniciar los sensores de entrada");
        }
    };
    //Deshabilita todos los sensores
    public closeSensors= (cb:callback):void=> {
        try {
            Gpio.destroy((err:any)=>{
                this.Log.LogDebug("Sensores deshabilidatos");
                cb(err);
            });
        }catch(e) {
            this.Log.LogError(e.stack+"Error detener sensores  ");
            cb(e);
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
        //innecesario
        if(this.location==7){
            callback(null);
        }
        this.estatemachine=true;
        //Lee el sensor de piso 7 para chequear si está allí
        Gpio.read(26,(err:any,state?:boolean)=>{
            if(state == true){
                this.location = 7;
                callback(null);
            }
        })
        //Proceso de busqueda de elevador
        if(this.location == null){
            this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
            this.motorStartUp();
            this.once("Sensor",()=>{
                this.Log.LogDebug("Deteccion de elevador");
                this.motorStop();
            })
            //Mueve el elevador para conseguir ubicación
            setTimeout(()=>{
                this.motorStop();
                if(this.location == null){
                    this.motorStartDown()
                    setTimeout(()=>{
                        if(this.location == null){
                            this.Log.LogAlert("Elevador no pudo ser encontrado");
                            //Analizar esto
                            //callback("Error - El elevador no pudo ser encontrado")
                        }
                        this.motorStop();
                    },2000)
                }else{
                    this.Log.LogDebug("Elevador encontrado en el piso: "+this.location);
                    this.gotoInitPosition(callback)
                }
            },2000)

        }
    }
    //Chequea posición del elevador según parámetro
    private checkPosition=(pos: number):boolean=>{
        if(this.location==pos){
            return true
        }else{
            return false;
        }
    }
    //Enciende el motor del elevador hacia abajo
    private motorStartDown= () =>{
        try {
            if(this.checkPosition(Maps.row.M.Piso)){
                this.Log.LogDebug("El Elevador está al limite inferior, no puede bajar mas");
            }else{
                this.mcp2.digitalWrite(Maps.MCP_Motor.Down.value, this.mcp2.HIGH);
                this.motorState = 2;
                this.Log.LogDebug("Elevador Bajando");
            }
        }catch(e) {
            this.Log.LogError("Error al bajar ascensor"+e.stack);
        }
    };
    //Enciende el motor del elevador hacia arriba
    private motorStartUp= () =>{
        try {
            if(this.checkPosition(Maps.row.A.Piso)){
                this.Log.LogDebug("El Elevador está al limite superior, no puede subir mas");
            }else{
                this.mcp2.digitalWrite(Maps.MCP_Motor.UP.value, this.mcp2.HIGH);
                this.motorState = 1;
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
            this.motorState = 0;
            this.Log.LogDebug("Elevador detenido");
            this.goingTo=0;
        }catch(e) {
            this.Log.LogError("Error al detener ascensor"+e.stack);
        }
    };
    //Inicia el motor de una cinta específica
    public motorCintaStart= (row: number, coll:number, coll2:number) =>{
        try {
            _async.parallel([()=>{
                this.mcp1.digitalWrite(Number(row), this.mcp1.HIGH);
            },()=>{
                this.mcp1.digitalWrite(Number(coll), this.mcp1.HIGH);
            },()=>{
                if(coll2!=null){
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
    //Recibe señal de entrada y determina de donde proviene
    private signal=(pin:number,state:boolean)=>{
            switch (pin) {
                case Maps.Sensor.S1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S1 On");
                        if(this.motorState!=0){
                            this.location = 1;
                        }
                        if(this.goingTo == this.location||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S1 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.S2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S2 On");
                        if(this.motorState!=0){
                            this.location = 2;
                        }
                        if(this.goingTo == this.location){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S2 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.S3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S3 On");
                        if(this.motorState!=0){
                            this.location = 3;
                        }
                        if(this.goingTo == this.location){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S3 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.S4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S4 On");
                        if(this.motorState!=0){
                            this.location = 4;
                        }
                        if(this.goingTo == this.location){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S4 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.S5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S5 On");
                        if(this.motorState!=0){
                            this.location = 5;
                        }
                        if(this.goingTo == this.location){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S5 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.S6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S6 On");
                        if(this.motorState!=0){
                            this.location = 6;
                        }
                        if(this.goingTo == this.location){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S6 Off");
                    }
                    if(this.receivingItem){
                        this.emit("Item recibido",this.location,state);
                    }
                    this.emit("Sensor",this.location,state);
                    break;
                case Maps.Sensor.SM.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor SM On");
                        if(this.motorState!=0){
                            this.location = 7;
                        }
                        if(this.goingTo == this.location||this.motorState == 2){
                            setTimeout(()=>{
                                this.motorStop();
                            },200)
                        }
                    } else {
                        this.Log.LogDebug("Sensor SM Off");
                    }
                    this.emit("Sensor",this.location,state);
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
                    if (state === false) {
                        this.Log.LogDebug("Elevador subiendo de forma manual");
                        this.motorStartUp();
                    } else {
                        this.Log.LogDebug("Elevador detuvo subida manual");
                        this.motorStop()
                    }
                    break;
                case Maps.elevator.Down.PIN:
                    if (state === false) {
                        this.Log.LogDebug("Elevador bajando de forma manual");
                        this.motorStartDown()
                    } else {
                        this.Log.LogDebug("Elevador detuvo bajada manual");
                        this.motorStop()
                    }
                    break;
                case Maps.general.stop.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador se detuvo??");
                    } else {
                        this.Log.LogDebug("Elevador se mueve??");
                    }
            }
    }
    //Enviar el elevador a una fila específica
    public GoTo=(callback:any,row:number)=>{
        this.Log.LogDebug("Elevador se dirige a la posición: "+row)
        if(this.enableMachine==true){
            this.goingTo = row;
            if(this.location==row){
                this.Log.LogDebug("El elevador esta en posición");
                callback(null);//Agregue este
            }else{
                if(this.location>row){
                    this.motorStartUp();
                }else if(this.location<row){
                    this.motorStartDown();
                }
                //atascos
                let time:any= setTimeout(()=>{
                    if(this.motorState!=0){
                        this.motorStop()
                        this.emit("Event",{cmd:"Elevador atascado"})
                        callback("Posible atasco del elevador")
                    }
                },15000)

                //Espera la posición de destino
                let wait:any = setInterval(()=>{
                    if(this.location==row){
                        this.Log.LogDebug("Elevador llego a la posición");
                        if(this.isDelivery==true){
                            setTimeout(()=>{
                                this.motorStop();
                                callback(null)
                            },150)
                        }else{
                            callback(null);
                        }
                        clearTimeout(time);
                        clearInterval(wait);
                        wait=null;
                    }
                },150)
            }
        }else{
            this.Log.LogError("La máquina esta deshabilidata debido a falla de inicio de puerto de sensor")
        }
    }
    //Prepara y ajusta posición del elevador para recibir artículo
    private prepareForDispense=(callback: any, height:number)=> {
        let timeForDown = height * 10;
        if (this.checkPosition(this.location)) {
            this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
            this.motorStartDown();
            setTimeout(() => {
                this.motorStop();
                this.Log.LogDebug("Elevador ubicado y listo para recibir");
                this.receivingItem= true;
                callback(null)
            }, timeForDown)
        } else {
            this.Log.LogError("El elevador no está en posición para recibir");
        }
    }
    //Proceso completo para dispensar artículo al cliente
    public dispenseItem=(piso: number, c1:number,c2:number|null, height: number, callback:callback)=>{
        this.estatemachine=true;
        if(this.enableMachine){
            this.findRow(piso,c1,c2,(err:any,row:any,coll_1:any,coll_2:any)=>{
                this.Log.LogDebug("Dispensando desde piso "+piso+" columna 1: "+c1+" columna 2+ "+c2)
                this.Log.LogDebug("Comenzando proceso de dispensar item");
                _async.series([
                    (callback:any)=>{
                        this.Log.LogDebug("Step 1 Verificando posición de elevador");
                        if(this.location==7){
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
                        this.prepareForDispense(callback, height)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 4 Dispensado artículo desde cinta");
                        this.motorCintaStart(row, coll_1, coll_2);
                        this.receivingItem= true;
                        this.once("Item recibido",()=>{
                            console.log("Articulo recibido")
                            this.motorCintaStop(row, coll_1, coll_2);
                            this.receivingItem=false;
                            callback(null);
                        })
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 5 Bajando elevador para realizar entrega");
                        this.receivingItem= false;
                        this.isDelivery=true;
                        //Tal vez un tiempo?
                        this.GoTo(callback,7);
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 6 Esperando evento del retiro del articulo");
                        this.emit("Event",{cmd:"Ok_dispensing", data:true})
                        let wait:any = setInterval(()=>{
                            if (global.Is_empty){
                                //this.GoTo(callback,6)
                                this.gotoInitPosition(callback)
                                clearInterval(wait)
                                wait=null;
                            }
                        },5000)
                    },
                    (callback:any)=>{
                        this.motorStartDown();
                        setTimeout(() => {
                            this.motorStop();
                            this.Log.LogDebug("Elevador ubicado en posición inicial");
                            this.receivingItem= true;
                            callback(null)
                        }, 400)
                    }
                ],(result?:any)=> {
                    this.receivingItem=false;
                    this.estatemachine=false;
                    if(result == null) {
                        this.Log.LogDebug('Proceso de venta completo '+result);
                        callback(result);
                    } else{
                        this.Log.LogAlert("Error");
                        callback(result);
                    }
                })
            })
        }else{
            callback("Máquina deshabilitada por falla en sensor serial")
        }
    }
    //Obtiene los pines de los motores de las celdas
    private findRow= (row: number, col_1:number,col_2:number|null, callback:any) =>{
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
                        _async.mapSeries(global.MCP_row,(Row:any,cb:callback)=>{
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
            _log.error(e.stack+'error seleccionando columna' );
        }
    };
    //Ubicar el elevador en la posición inicial
    private gotoInitPosition=(callback:callback)=>{
        this.Log.LogDebug("InitPos - Elevador va a posición inicial");
        _async.series([
            //Step 1 - Ubicando elevador en posicion 7
            (callback:any)=>{
                //this.GoTo(callback,6);
                this.Log.LogDebug("InitPos - Ubicando elevador en la parte inferior, piso 7")
                this.GoTo(callback,7);
            },
            //Step 2 - Ajustando altura de Elevador
            (callback:any)=>{
                this.Log.LogDebug("InitPos - Ajustando altura para bloqueo de puerta principal")
                this.motorStartUp();
                setTimeout(() => {
                    this.motorStop();
                    this.Log.LogDebug("InitPos - Elevador ubicado en posición inicial");
                    //this.receivingItem= true;
                    //Le indica al elevador que se encuentra abajo -- Pendiente
                    this.location=7;
                    callback(null)
                }, 200)
            }
        ],(result?:any)=> {
            if(result == null) {
                this.Log.LogDebug('InitPos - Elevador ubicado correctamente '+result);
                this.estatemachine = false;
                callback(null);
            } else{
                this.Log.LogAlert("Error ubicando en la posición inicial");
                callback(result);
            }
        })
    }
}