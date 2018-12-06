import global from'./Global';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import Event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
import _async, {forEach, timeout} from "async";
import {Logger} from "ci-syslogs";
import _log from "@ci24/ci-logmodule";

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
    private motorState: number = 0;
    //motorState 0 stop
    //motorState 1 up
    //motorState 2 down
    private dispense: boolean = false;

    constructor(){
        super();
        this.Log.LogDebug("Control inicializado");
        Gpio.on('change', this.signal);
        this.initOuts();
        this.initSensors();
    }

    private checkPosition=(pos: number):boolean=>{
        if(global.machinelocation==pos){
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

    public initSensors= ():void =>{
        try {
            this.Log.LogDebug("Inicializando sensores");
            //----------Sensores-------------------//
            Gpio.setup(global.Sensor.S1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.SM.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            //Gpio.setup(global.Sensor.SM.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH, this.initial_elevator);

            // Gpio.setup(global.Pulso.P1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP1);
            // Gpio.setup(global.Pulso.P2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP2);
            // Gpio.setup(global.Pulso.P3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP3);
            // Gpio.setup(global.Pulso.P4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP4);
            // Gpio.setup(global.Pulso.P5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP5);
            // Gpio.setup(global.Pulso.P6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP6);

            Gpio.setup(global.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.elevator.Up.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.elevator.Down.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.general.stop.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            this.Log.LogDebug("Inicializando sensores");
        }catch(e) {
            this.Log.LogError("Error al iniciar los sensores");
            this.Log.LogError(e.stack+ JSON.stringify(global.result.ERROR_INIT_GPIO));
        }
    };

    public closeSensors= (cb:callback):void=> {
        try {
            Gpio.destroy((err:any)=>{
                this.Log.LogDebug("Sensores deshabilidatos");
                _log.write('Desabilitados tods los sensores'+err);
                cb(err);
            });
        }catch(e) {
            _log.error(e.stack+"Error detener sensores  ");
            cb(e);
        }
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
            if(this.checkPosition(7)){
                this.Log.LogDebug("El Elevador está en la PO, no puede bajar mas");
            }else{
                this.mcp2.digitalWrite(global.MCP_Motor.Down.value, this.mcp2.HIGH);
                this.motorState = 2;
                this.Log.LogDebug("Elevador Bajando");
            }
        }catch(e) {
            this.Log.LogError("Error al bajar ascensor"+e.stack);
        }
    };

    private motorStartUp= () =>{
        try {
            if(this.checkPosition(1)){
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
                        global.machinelocation= 1;
                        if(this.goingTo == global.machinelocation||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S1 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.S2.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S2 On");
                        global.machinelocation = 2;
                        if(this.goingTo == global.machinelocation||this.motorState == 1){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S2 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.S3.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S3 On");
                        global.machinelocation = 3;
                        if(this.goingTo == global.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S3 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.S4.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S4 On");
                        global.machinelocation= 4;
                        if(this.goingTo == global.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S4 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.S5.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S5 On");
                        global.machinelocation = 5;
                        if(this.goingTo == global.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S5 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.S6.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor S6 On");
                        global.machinelocation = 6;
                        if(this.goingTo == global.machinelocation){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor S6 Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
                    break;
                case global.Sensor.SM.PIN:
                    if (state === true) {
                        this.Log.LogDebug("Sensor SM On");
                        global.machinelocation = 7;
                        if(this.goingTo == global.machinelocation||this.motorState == 2){
                            this.motorStop();
                        }
                    } else {
                        this.Log.LogDebug("Sensor SM Off");
                    }
                    this.emit("Sensor",global.machinelocation,state);
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
        if(global.machinelocation==row){
            this.Log.LogDebug("El elevador esta en posición");
        }else{
            if(global.machinelocation>row){
                this.motorStartUp();
            }else if(global.machinelocation<row){
                this.motorStartDown();
            }
        }
    }

    public dispenseItem=(row: number, coll:number, timewait: number)=>{
        this.Log.LogDebug("Comenzando proceso de dispensar item");
        _async.series([()=>{
                this.GoTo(row);
            },
                timeout(()=>{
                    if(this.checkPosition(global.machinelocation)){
                        this.Log.LogDebug("Comenzando proceso de retroceso");
                        this.motorStartDown();
                        timeout(()=>{
                            this.motorStop
                        },100)
                    }else{
                        this.Log.LogError("El elevador no está en posición para dispensar");
                    }
                },1000),
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