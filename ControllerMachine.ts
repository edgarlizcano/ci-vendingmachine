import Maps from './Maps';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import Event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async from "async";
import {Logger} from "ci-syslogs";

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
    private goingTo: number = 0;
    private motorState: number = 0;//motorState: 0 stop, 1 going up, 2 going down
    //motorState 1 up
    //motorState 2 down
    private dispense: boolean = false;

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.signal);
        this.initOuts();
        this.initSensors();
        if(Maps.machinelocation==null){
            this.findElevator();
        }
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
    private findElevator=():void=>{
        Object.keys(Maps.Sensor).forEach(key => {
            Gpio.read(Maps.Sensor[key].PIN,(err:any, value?:any)=> {
                if (err != null) {
                    if(value==true){
                        this.Log.LogDebug("Elevador encontrado en"+ Maps.Sensor[key].Piso +" On");
                        Maps.MachineLocation = Maps.Sensor[key].Piso;
                    }else{
                        this.Log.LogDebug("Elevador no encontrado en "+ Maps.Sensor[key].Piso);
                    }
                }else{
                    this.Log.LogDebug("Error al leer sensor: "+Maps.Sensor[key].GPIO);
                    this.Log.LogDebug(Maps.Sensor[key].GPIO);
                }
            })
        })
        if(Maps.machinelocation == null){
            this.Log.LogDebug("Iniciando búsqueda");
            this.motorStartUp();
            setTimeout(()=>{
                this.motorStop();
                if(Maps.MachineLocation == null){
                    this.motorStartDown()
                    setTimeout(()=>{
                        this.motorStop();
                        if(Maps.MachineLocation == null){
                            this.Log.LogAlert("Elevador no pudo ser encontrado");
                        }
                    },1200)
                }
            },1200)
        }
    }
    //Chequea posición del elevador según parámetro
    private checkPosition=(pos: number):boolean=>{
        if(Maps.machinelocation==pos){
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
        }catch(e) {
            this.Log.LogError("Error al detener ascensor"+e.stack);
        }
    };
    //Inicia el motor de una cinta específica
    private motorCintaStart= (row: number, coll:number) =>{
        try {
            _async.parallel([()=>{
                this.mcp1.digitalWrite(row, this.mcp2.HIGH);
            },()=>{
                this.mcp1.digitalWrite(coll, this.mcp2.HIGH);
            }])
            this.Log.LogDebug("Motor de celda activado");
        }catch(e) {
            this.Log.LogError("Error al activar celda"+e.stack);
        }
    };
    //Detiene el motor de una cinta específica
    private motorCintaStop= (row: number, coll:number) =>{
        try {
            _async.parallel([()=>{
                this.mcp1.digitalWrite(row, this.mcp2.LOW);
            },()=>{
                this.mcp1.digitalWrite(coll, this.mcp2.LOW);
            }])
            this.Log.LogDebug("Motor de celda detenido");
        }catch(e) {
            this.Log.LogError("Error al activar celda"+e.stack);
        }
    };
    //Recibe señal de entrada y determina de donde proviene
    private signal=(pin:number,state:boolean)=>{
        if (state === true) {
            switch (pin) {
                case Maps.Sensor.S1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S1 On");
                        Maps.machinelocation = 1;
                        if(this.goingTo == Maps.machinelocation||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S1 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.S2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S2 On");
                        Maps.machinelocation = 2;
                        if(this.goingTo == Maps.machinelocation||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S2 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.S3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S3 On");
                        Maps.machinelocation = 3;
                        if(this.goingTo == Maps.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S3 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.S4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S4 On");
                        Maps.machinelocation= 4;
                        if(this.goingTo == Maps.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S4 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.S5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S5 On");
                        Maps.machinelocation = 5;
                        if(this.goingTo == Maps.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S5 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.S6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S6 On");
                        Maps.machinelocation = 6;
                        if(this.goingTo == Maps.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S6 Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
                    break;
                case Maps.Sensor.SM.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor SM On");
                        Maps.machinelocation = 7;
                        if(this.goingTo == Maps.machinelocation||this.motorState == 2){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor SM Off");
                    }
                    this.emit("Sensor",Maps.machinelocation,state);
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
                    if (state === true) {
                        this.Log.LogDebug("Elevador subiendo???");
                    } else {
                        this.Log.LogDebug("Elevador detuvo subida?");
                    }
                    break;
                case Maps.elevator.Down.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador bajando???");
                    } else {
                        this.Log.LogDebug("Elevador detuvo bajada?");
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
    }
    //Enviar el elevador a una fila específica
    public GoTo=(row:number)=>{
        this.goingTo = row;
        if(Maps.machinelocation==row){
            this.Log.LogDebug("El elevador esta en posición");
        }else{
            if(Maps.machinelocation>row){
                this.motorStartUp();
            }else if(Maps.machinelocation<row){
                this.motorStartDown();
            }
        }
    }
    //Espera a que el elevador se ubique en la posición deseada
    private waitPosition=(callback:callback, piso:number)=>{
        this.Log.LogDebug("Esperando posición de elevador");
        let wait: any = setInterval(()=>{
            if(Maps.machinelocation==piso){
                clearInterval(wait);
                this.Log.LogDebug("Elevador llego a la posición");
                callback(null);
            }
        },150)
    }
    //Prepara y ajusta posición del elevador para recibir artículo
    private prepareForDispense=(callback: callback, height:number)=> {
        let timeForDown = height * 17;
        if (this.checkPosition(Maps.machinelocation)) {
            this.Log.LogDebug("Comenzando proceso de retroceso para ajuste de altura");
            this.motorStartDown();
            setTimeout(() => {
                this.motorStop();
                this.Log.LogDebug("Elevador ubicado y listo para recibir");
                callback(null)
            }, timeForDown)
        } else {
            this.Log.LogError("El elevador no está en posición para recibir");
        }
    }
    //Enciende cinta específica para dispensar un artículo
    private receiveItem=(callback: callback, row: number, coll: number)=> {
        this.motorCintaStart(row, coll);
        this.on("Sensor", () => {
            this.motorCintaStop(row, coll);
            this.Log.LogDebug("Articulo recibido en el elevador");
            callback(null);
        })
    }
    //Proceso completo para dispensar artículo al cliente
    public dispenseItem=(piso: number ,row: number, coll:number, height: number)=>{
        this.Log.LogDebug("Comenzando proceso de dispensar item");
        _async.series([
            (callback:any)=>{
                this.Log.LogDebug("Step 1 Ubicando elevador en posición");
                this.GoTo(piso);
                callback(null)
            },
            (callback:any)=>{
                this.Log.LogDebug("Step 2 Esperando la posicion del elevador");
                this.waitPosition(callback,piso);
            },
            (callback:any)=>{
                this.Log.LogDebug("Step 3 Ajustando posición del elevador segun tamaño");
                this.prepareForDispense(callback, 14)
            },
            (callback:any)=>{
                this.Log.LogDebug("Step 4 Dispensado artículo desde cinta");
                this.receiveItem(callback,row,coll);
            },
            (callback:any)=>{
                this.Log.LogDebug("Step 5 Bajando elevador para realizar entrega");
                this.GoTo(7);
                callback(null);
            },
        ],(callback)=>{
            if(!callback){
                console.log("Entrega Completa")
            }else{
                console.log("error")
            }
        })
    }
}