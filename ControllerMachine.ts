import global from'./Global';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import Event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async, {forEach, timeout} from "async";
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
    private position: number = 0;
    private goingTo: number = 0;
    private motorState: number = 0;
    private dispense: boolean = false;

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.signal);
        this.initOuts();
    }

    private checkPosition=(pos: number):boolean=>{
        if(this.position==pos){
            return true
        }else{
            return false;
        }
    }

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

    private motorStartDown= () =>{
        try {
            if(this.checkPosition(0)){
                this.Log.LogDebug("El Elevador está en la PO, no puede bajar mas");
            }else{
                this.mcp2.digitalWrite(global.MCP_Motor.Down.value, this.mcp2.HIGH);
                this.motorState = 2;
                this.Log.LogDebug("Elevador subiendo");
            }
        }catch(e) {
            this.Log.LogError("Error al subir ascensor"+e.stack);
        }
    };

    private motorStartUp= () =>{
        try {
            if(this.checkPosition(6)){
                this.Log.LogDebug("El Elevador está en la P6, no puede subir mas");
            }else{
                this.mcp2.digitalWrite(global.MCP_Motor.UP.value, this.mcp2.HIGH);
                this.motorState = 1;
                this.Log.LogDebug("Elevador subiendo");
            }
        }catch(e) {
            this.Log.LogError("Error al subir ascensor"+e.stack);
        }
    };

    public motorStop= () =>{
        try {
            this.mcp2.digitalWrite(global.MCP_Motor.Down.value, this.mcp2.LOW);
            this.mcp2.digitalWrite(global.MCP_Motor.UP.value, this.mcp2.LOW);
            this.motorState = 0;
            this.Log.LogDebug("Elevador detenido");
        }catch(e) {
            this.Log.LogError("Error al detener ascensor"+e.stack);
        }
    };

    public motorCintaStart= (row: number, coll:number) =>{
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

    public motorCintaStop= (row: number, coll:number) =>{
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

    public signal=(pin:number,state:boolean)=> {
        if (state === true) {
            switch (pin) {
                case global.Sensor.S1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S1 On");
                        this.position= 1;
                        if(this.goingTo == this.position){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S1 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.S2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S2 On");
                        this.position = 2;
                        if(this.goingTo == this.position){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S2 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.S3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S3 On");
                        this.position = 3;
                        if(this.goingTo == this.position){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S3 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.S4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S4 On");
                        this.position= 4;
                        if(this.goingTo == this.position){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S4 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.S5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S5 On");
                        this.position = 5;
                        if(this.goingTo == this.position){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S5 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.S6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S6 On");
                        this.position = 6;
                        if(this.goingTo == this.position||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S6 Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Sensor.SM.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor SM On");
                        this.position = 0;
                        if(this.goingTo == this.position||this.motorState == 0){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor SM Off");
                    }
                    this.emit("Sensor",this.position,state);
                    break;
                case global.Pulso.P1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 1");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 1");
                    }
                    break;
                case global.Pulso.P2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 2");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 2");
                    }
                    break;
                case global.Pulso.P3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 3");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 3");
                    }
                    break;
                case global.Pulso.P4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 4");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 4");
                    }
                    break;
                case global.Pulso.P5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 5");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 5");
                    }
                    break;
                case global.Pulso.P6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor vuelta piso 6");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor vuelta piso 6");
                    }
                    break;
                case global.Aux.A1.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor Aux A1");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor Aux A1");
                    }
                    break;
                case global.Aux.A2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso On sensor Aux A2");
                    } else {
                        this.Log.LogDebug("Pulso Off sensor Aux A2");
                    }
                    break;
                case global.Card.Int.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso Card In On");
                    } else {
                        this.Log.LogDebug("Pulso Card In Off");
                    }
                    break;
                case global.Card.Out.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Pulso Card Out On");
                    } else {
                        this.Log.LogDebug("Pulso Card Out Off");
                    }
                    break;
                case global.elevator.Up.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador subiendo???");
                    } else {
                        this.Log.LogDebug("Elevador detuvo subida?");
                    }
                    break;
                case global.elevator.Down.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador bajando???");
                    } else {
                        this.Log.LogDebug("Elevador detuvo bajada?");
                    }
                    break;
                case global.general.stop.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Elevador se detuvo??");
                    } else {
                        this.Log.LogDebug("Elevador se mueve?");
                    }
            }
        }
    }

    public GoTo=(row:number)=>{
        this.goingTo = row;
        if(this.position==row){
            this.Log.LogDebug("El elevador esta en posición");
        }else{
            if(this.position>row){
                this.motorStartDown();
            }else if(this.position<row){
                this.motorStartUp();
            }
        }
    }

    public dispenseItem=(row: number, coll:number, timewait: number)=>{
        this.Log.LogDebug("Comenzando proceso de dispensar item");
        _async.series([()=>{
                this.GoTo(row);
            },
                timeout(()=>{
                    if(this.checkPosition(this.position)){
                        //Programar retroceso
                    }else{
                        this.Log.LogError("El elevador no está en posición para dispensar");
                    }
                },timewait),
                    timeout(()=>{
                        this.motorCintaStart(row,coll);
                    },2000),
                        timeout(()=>{
                            this.on("Sensor",(pos,state)=>{
                            this.motorCintaStop(row, coll);
                        })
                        },1000),
                            timeout(()=>{
                                this.GoTo(0);
                            },1000)
        ])
    }
}