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
    private estatemachine: boolean = false;

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.signal);
        this.on("Sensor",(pin, state)=>{
            if(this.estatemachine==true && pin!=Maps.elevator.Up.PIN && pin!=Maps.elevator.Down.PIN){
                this.Log.LogAlert("Alerta, sensor activado cuando la máquina está inactiva pin: "+pin)
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
                this.enableMachine=true;
                this.securityState(false);
                this.emit("Event",{cmd:"Maquina_Lista"})
                if(this.location==null){
                    this.findElevator((cb:any)=>{
                        this.Log.LogDebug("Fin de proceso de busqueda de elevador")
                    });
                }
            }else{
                this.emit("Event",{cmd:"Error_puerto_serial"})
            }
        },5000)
    }
    //Habilita o deshabilita seguridad
    private securityState=(state:boolean)=>{
        this.estatemachine=state;
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
        //Proceso de busqueda de elevador
        if(this.location == null){
            this.Log.LogDebug("Ubicación desconocida - Iniciando búsqueda");
            this.motorStartUp();
            this.once("Sensor",(piso, state)=>{
                if(state == true){
                    this.Log.LogDebug("Deteccion de elevador en: "+piso);
                    this.location=piso;
                    this.motorStop();
                }
            })
            //Mueve el elevador para conseguir ubicación
            setTimeout(()=>{
                this.motorStop();
                if(this.location == null){
                    this.motorStartDown()
                    setTimeout(()=>{
                        if(this.location == null){
                            this.Log.LogAlert("Elevador no pudo ser encontrado");
                            callback("Error - El elevador no pudo ser encontrado")
                        }
                        this.motorStop();
                    },2000)
                }else{
                    this.Log.LogDebug("Elevador encontrado en el piso: "+this.location);
                    this.gotoInitPosition(callback)
                }
            },2500)
        }else{
            this.Log.LogDebug("Elevador encontrado en el piso: "+this.location);
            callback(null)
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
                        if(this.goingTo == 2 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 2 - Se detectó el elevador en la posición 1")
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
                        if(this.goingTo == 3 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 3 - Se detectó el elevador en la posición 2")
                            this.motorStop();
                        }
                        if(this.goingTo == 1 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 1 - Se detectó el elevador en la posición 2")
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
                        if(this.goingTo == 4 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 4 - Se detectó el elevador en la posición 3")
                            this.motorStop();
                        }
                        if(this.goingTo == 2 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 2 - Se detectó el elevador en la posición 3")
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
                        if(this.goingTo == 5 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 5 - Se detectó el elevador en la posición 4")
                            this.motorStop();
                        }
                        if(this.goingTo == 3 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 3 - Se detectó el elevador en la posición 4")
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
                        if(this.goingTo == 6 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 6 - Se detectó el elevador en la posición 5")
                            this.motorStop();
                        }
                        if(this.goingTo == 4 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 4 - Se detectó el elevador en la posición 5")
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
                        if(this.goingTo == 7 && this.motorState == 1){
                            this.Log.LogAlert("Se paso de posición 7 - Se detectó el elevador en la posición 6")
                            this.motorStop();
                        }
                        if(this.goingTo == 5 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 5 - Se detectó el elevador en la posición 6")
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
                            if(this.isDelivery==true){
                                setTimeout(()=>{
                                    this.motorStop();
                                },200)
                            }else{
                                this.motorStop();
                            }
                        }
                        if(this.goingTo == 6 && this.motorState == 2){
                            this.Log.LogAlert("Se paso de posición 6 - Se detectó el elevador en la posición 7")
                            this.motorStop();
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
                        this.securityState(false)
                        //this.motorStartUp();
                        this.mcp2.digitalWrite(Maps.MCP_Motor.UP.value, this.mcp2.HIGH);
                    } else {
                        this.Log.LogDebug("Elevador detuvo subida manual");
                        this.motorStop()
                        this.securityState(true)
                    }
                    break;
                case Maps.elevator.Down.PIN:
                    if (state === false) {
                        this.Log.LogDebug("Elevador bajando de forma manual");
                        this.securityState(false)
                        //this.motorStartDown()
                        this.mcp2.digitalWrite(Maps.MCP_Motor.Down.value, this.mcp2.HIGH);
                    } else {
                        this.Log.LogDebug("Elevador detuvo bajada manual");
                        this.motorStop()
                        this.securityState(true)
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
        this.securityState(false);
        this.Log.LogDebug("Elevador se dirige a la posición: "+row)
        this.goingTo = row;
        if(this.checkPosition(row)){
            this.Log.LogDebug("El elevador esta en posición");
            callback(null);
        }else{
            if(this.location>row){
                this.motorStartUp();
            }else if(this.location<row){
                this.motorStartDown();
            }
            this.Log.LogDebug("Esperando posición del elevador");
            //v5
            let atasco:boolean = false;
            let time:number = 0;

            //Espera la posición de destino
            let wait:any = setInterval(()=>{
                time+=100;
                if(this.checkPosition(row)){
                    this.Log.LogDebug("Elevador llego a la posición");
                    clearInterval(wait);
                    wait=null;
                    callback(null);
                }
                if(time>12000){
                    this.Log.LogDebug("Error de atasco despues de 12 segundos");
                    clearInterval(wait);
                    this.motorStop()
                    wait=null;
                    callback("Error de atasco despues de 12 segundos")
                }
            },100)
        }
    }
    //Prepara y ajusta posición del elevador para recibir artículo
    private prepareForDispense=(callback: any, height:number)=> {
        let timeForDown = height * 13;
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
    //Tiempo de espera para que el cliente retire el producto
    private waitForRemoveItem=(callback:any)=>{
        setTimeout(()=>{
            if(global.Is_empty == false){
                this.Log.LogDebug("Hay un producto en el elevador para retirar")
                let wait:any = setInterval(()=>{
                    if (global.Is_empty){
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
        },1000)
    }
    //Proceso completo para dispensar artículo al cliente
    public dispenseItem=(piso: number, c1:number,c2:number|null, height: number, callback:callback)=>{
        this.Log.LogDebug("Comenzando proceso de dispensar item en el piso "+piso);
        this.securityState(false)
        if(this.enableMachine){
                this.Log.LogDebug("Comenzando proceso de dispensar item");
                _async.series([
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
                        this.receivingItem= false;
                        this.isDelivery=true;
                        this.GoTo(callback,7);
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 6 Esperando evento del retiro del articulo");
                        this.emit("Event",{cmd:"Ok_dispensing", data:true})
                        this.waitForRemoveItem(callback)
                    },
                    (callback:any)=>{
                        this.Log.LogDebug("Step 7 Asegurando puerta");
                        setTimeout(()=>{
                            this.gotoInitPosition(callback)
                        },8000)
                    }
                ],(result?:any)=> {
                    this.receivingItem=false;
                    if(result == null) {
                        this.Log.LogDebug('Proceso de venta completo '+result);
                        callback(result);
                    } else{
                        this.Log.LogAlert("Error: "+result);
                        this.stopAll();
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
            this.Log.LogError(e.stack+'error seleccionando columna' );
        }
    };
    //Ubicar el elevador en la posición inicial
    private gotoInitPosition=(callback:callback)=>{
        this.Log.LogDebug("InitPos - Elevador va a posición inicial");
        _async.series([
            //Step 1 - Ubicando elevador en posicion 7
            (callback:any)=>{
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
                    this.securityState(true);
                    callback(null)
                }, 400)
            }
        ],(result?:any)=> {
            if(result == null) {
                this.Log.LogDebug('InitPos - Elevador ubicado correctamente '+result);
                this.securityState(true)
                callback(null);
            } else{
                this.Log.LogAlert("Error ubicando en la posición inicial");
                callback(result);
            }
        })
    }

    //Beta de dispensar
    private dispense=(piso:number, coll_1:number, coll_2:any,callback: any)=> {
        this.findRow(piso, coll_1,coll_2,(err:any,row:any,c1:any,c2:any )=>{
            this.Log.LogDebug("Dispensando desde piso "+piso+" columna 1: "+c1+" columna 2+ "+c2)
            this.Log.LogDebug("Dispensado artículo desde cinta");
            this.motorCintaStart(row, c1, c2);
            this.receivingItem= true;
            this.once("Item recibido",()=>{
                console.log("Articulo recibido")
                this.motorCintaStop(row, coll_1, coll_2);
                this.receivingItem=false;
                callback(null);
            })
        })
    }
    //Test celdas
    private testCeldas=(piso:number, coll_1:number, coll_2:number,callback: any)=> {
        this.findRow(piso, coll_1,coll_2,(err:any,row:any,c1:any,c2:any )=>{
            this.Log.LogDebug("Iniciando test de celda");
            this.motorCintaStart(row, c1, c2);
            setTimeout(()=>{
                this.motorCintaStop(row, coll_1, coll_2);
                console.log("Test de celda finalizado")
                callback(null);
            },4000)
        })
    }

    //**************************Beta*******************************!//
    //Control de atascos - Probar
    private atasco:boolean = false;
    private intentos:number=0;

    //Controla el tiempo de avance del motor
    private controlTime=(row:number, callback:any)=>{
        //Espera la posición de destino
        let nPisos = this.location - this.goingTo;
        let time = 0;
        let countTime = 500;
        if(nPisos<0){
            nPisos = nPisos * -1;
        }
        time = nPisos * 2000;
        this.Log.LogDebug("Se movera "+nPisos+ " en un tiempo límite para llegar a destino es "+time)
        //Espera la posición de destino
        let wait:any = setInterval(()=>{
            console.log(countTime)
            countTime=countTime+100;
            if(this.location == this.goingTo){
                this.Log.LogDebug("Elevador llego en: "+countTime)
                clearInterval(wait)
                wait=null;
                callback(null)
            }
            if(countTime>time){
                this.Log.LogDebug("Leyendo posible atasco, countTime: "+countTime)
                this.controlAtasco(this.motorState,callback);
                clearInterval(wait)
                wait=null;
            }
        },100)
    }
    //Controla intentos de desatascos del elevador
    private controlAtasco=(callback:any, row:number)=>{
        this.atasco = true
        this.intentos ++
        if(this.intentos>3){
            this.Log.LogCritical("Elevador atascado luego de 3 intentos - Se requiere revisión")
            callback("Elevador atascado luego de 3 intentos - Se requiere revisión")
        }else{
            this.Log.LogAlert("Intento de desatasco número :"+this.intentos)
            this.Log.LogDebug("Comenzando proceso de desatasco número: "+this.intentos)
            if(this.motorState==1){
                this.Log.LogDebug("Bajando para desatascar")
                this.motorStartDown()
                setTimeout(()=>{
                    this.motorStop()
                    setTimeout(()=>{
                        this.GoTo(callback,row)
                        //callback(null)
                    },1500)
                },1500)
            }else{
                this.Log.LogDebug("Subiendo para desatascar")
                this.motorStartUp
                setTimeout(()=>{
                    this.motorStop()
                    setTimeout(()=>{
                        this.GoTo(callback,row)
                        //callback(null)
                    },1500)
                },1500)
            }
        }
    }

    //Enviar el elevador a una fila específica con control de atascos
    public GoTo2=(callback:any,row:number)=>{
        this.securityState(false);
        this.Log.LogDebug("Elevador se dirige a la posición: "+row)
        this.goingTo = row;
        if(this.location==row){
            this.Log.LogDebug("El elevador esta en posición");
            callback(null);
        }else{
            if(this.location>row){
                this.motorStartUp();
            }else if(this.location<row){
                this.motorStartDown();
            }
            //Espera la posición de destino y verifica atascos
            this.controlTime(row,callback);
        }
    }

    //Version 5
    //Separación de modulo de dispensar y se agregó a dispense Item - Probar
    //Validación de que se paso de piso - Probar
    //Verificacion de tiempos de atasco - Probar
    //Bajar y subir por botones sin limites

}