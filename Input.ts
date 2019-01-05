import _log from "@ci24/ci-logmodule";
import global from './Global2';
import rpio from 'rpio';
import event from 'events';
import Gpio from "rpi-gpio";
import {callback} from "./Interfaces";
/*import _async from "async";
import {Output} from './Output';*/

//let folderLogs = "/free/CI24/Logs/Machine";
//_log.init(folderLogs);
export class Input extends event.EventEmitter {
    constructor(_principal:any) {
        super();
        rpio.on('change', this.pollcbsensor);
        this.Principal=_principal;
    }
    // private Out1: any    = new Output();
    public  Principal   :any;
    private Is_pin_ok   :any =[];
    private P1=false;
    private P2=false;
    private P3=false;
    private P4=false;
    private P5=false;
    private P6=false;
    private SM=false;

    public Open= ():void =>{
        try {
            //----------Sensores-------------------//
            Gpio.setup(global.Sensor.S1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.S6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Sensor.SM.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH, this.initial_elevator);

            Gpio.setup(global.Pulso.P1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP1);
            Gpio.setup(global.Pulso.P2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP2);
            Gpio.setup(global.Pulso.P3.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP3);
            Gpio.setup(global.Pulso.P4.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP4);
            Gpio.setup(global.Pulso.P5.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP5);
            Gpio.setup(global.Pulso.P6.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH,this.readInput_InP6);

            Gpio.setup(global.Aux.A1.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Aux.A2.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.Card.Int.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.Card.Out.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.elevator.Up.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);
            Gpio.setup(global.elevator.Down.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

            Gpio.setup(global.general.stop.PIN, Gpio.DIR_IN, Gpio.EDGE_BOTH);

        }catch(e) {
            _log.error(e.stack+ JSON.stringify(global.result.ERROR_INIT_GPIO));
        }
    };


    public Close= (cb:callback):void=> {
        try {
            Gpio.destroy((err:any)=>{
                _log.write('Desabilitados todos los sensores'+err);
                cb(err);
            });
        }catch(e) {
            _log.error(e.stack+"Error detener sensores  ");
            cb(e);
        }
    };


    public initial_elevator=()=>{
        Gpio.read(global.Sensor.SM.PIN,(err:any|null, value?:any)=> {
            if (err == null) {
                if(value==true){
                   // this.emit("Sensor On","SM");
                    _log.write("Sensor On "+"SM");
                    this.Principal.Is_init_location=true;
                    this.SM=true;
                }else{
                  //  this.emit("Sensor off","SM");
                    this.Principal.Is_init_location=false;
                    _log.write("Sensor Off "+"SM");
                    this.SM=false;
                }
            }else{
                _log.error('no se pudo iniziaclizar el estado de elevador ');
            }
        });
    };
    public initial_elevator_call=(data:null,cb:callback)=>{
        Gpio.read(global.Sensor.SM.PIN,(err:any|null, value?:any)=> {
            if (err == null) {
                if(value==true){
                    // this.emit("Sensor On","SM");
                    _log.write("Sensor On "+"SM");
                    this.Principal.Is_init_location=true;
                    this.SM=true;
                    cb(null);
                }else{
                    //  this.emit("Sensor off","SM");
                    this.Principal.Is_init_location=false;
                    _log.write("Sensor Off "+"SM");
                    this.SM=false;
                    cb(null)
                }
            }else{
                _log.error(JSON.stringify(global.result.ERROR_READ_PIN_SM));
                cb('Error: '+global.result.ERROR_READ_PIN_SM.value)
            }
        });
    };
    private readInput_InP1=():void=>{
        this.initial_pin(global.Pulso.P1,global.motoresPiso.A)
    };
    private readInput_InP2=():void=>{
        this.initial_pin(global.Pulso.P2,global.motoresPiso.B)
    };
    private readInput_InP3=():void=>{
        this.initial_pin(global.Pulso.P3,global.motoresPiso.C)
    };
    private readInput_InP4=():void=>{
        this.initial_pin(global.Pulso.P4,global.motoresPiso.D)
    };
    private readInput_InP5=():void=>{
        this.initial_pin(global.Pulso.P5,global.motoresPiso.E)
    };
    private readInput_InP6=():void=>{
        this.initial_pin(global.Pulso.P6,global.motoresPiso.F)
    };

    private initial_pin=(pin:any,array:any)=>{
        Gpio.read(pin.PIN,(err:any|null, value?:any)=> {
            if (err == null) {
                if(value==true){
                    _log.warning("Sensor  "+ pin.text+"   Mal ubicado se empieza a reubicar");
                    this.Is_pin_ok.push(array);
                }else{
                    _log.write("Sensor  "+ pin.text+"   En pocision correcta");
                }
            }else{
                _log.error('no se pudo iniziaclizar el estado de elevador ');
            }
        });
    };


    public pollcbsensor=(pin:number,state:boolean)=>{
        this.Emit(state,pin);
    };
    public Emit=(state:boolean,pin:number):void=>{
        if(state===true){
            switch (pin) {
                case global.Sensor.S1.PIN:
                    this.emit("Sensor On","S1");
                    _log.write("Sensor On "+"S1");
                    break;
                case global.Sensor.S2.PIN:
                    this.emit("Sensor On","S2");
                    _log.write("Sensor On "+"S2");
                    break;
                case global.Sensor.S3.PIN:
                    this.emit("Sensor On","S3");
                    _log.write("Sensor On "+"S3");
                    break;
                case global.Sensor.S4.PIN:
                    this.emit("Sensor On","S4");
                    _log.write("Sensor On "+"S4");
                    break;
                case global.Sensor.S5.PIN:
                    this.emit("Sensor On","S5");
                    _log.write("Sensor On "+"S5");
                    break;
                case global.Sensor.S6.PIN:
                    this.emit("Sensor On","S6");
                    _log.write("Sensor On "+"S6");
                    break;
                case global.Sensor.SM.PIN:
                    if(this.SM==false){
                        this.emit("Sensor On","SM");
                        _log.write("Sensor On "+"SM");
                        this.SM=true
                    }
                    break;
                case global.Pulso.P1.PIN:
                    if(this.P1==false){
                        this.emit("Input On","P1");
                        _log.write(" On "+"P1");
                        this.P1=true
                    }
                    break;
                case global.Pulso.P2.PIN:
                    if(this.P2==false){
                        this.emit("Input On","P2");
                        _log.write(" On "+"P2");
                        this.P1=true
                    }
                    break;
                case global.Pulso.P3.PIN:
                    if(this.P3==false){
                        this.emit("Input On","P3");
                        _log.write(" On "+"P3");
                        this.P3=true
                    }
                    break;
                case global.Pulso.P4.PIN:
                    if(this.P4==false){
                        this.emit("Input On","P4");
                        _log.write(" On "+"P4");
                        this.P4=true
                    }
                    break;
                case global.Pulso.P5.PIN:
                    if(this.P5==false){
                        this.emit("Input On","P5");
                        _log.write(" On "+"P5");
                        this.P5=true
                    }
                    break;
                case global.Pulso.P6.PIN:
                    if(this.P6==false){
                        this.emit("Input On","P6");
                        _log.write(" On "+"P6");
                        this.P6=true
                    }
                    break;
                case global.Aux.A1.PIN:
                    this.emit("Aux On","A1");
                    break;
                case global.Aux.A2.PIN:
                    this.emit("Aux On","A2");
                    break;
                case global.Card.Int.PIN:
                    this.emit("Card On","Int");
                    break;
                case global.Card.Out.PIN:
                    this.emit("Card On","Out");
                    break;
                case global.elevator.Up.PIN:
                    this.emit("elevator Off","Up");
                    _log.write(" On "+"Up");
                    break;
                case global.elevator.Down.PIN:
                    this.emit("elevator Off","Down");
                    _log.write(" On "+"down");
                    break;
                case global.general.stop.PIN:
                    this.emit("Stop","on");
                    _log.write(" On "+"Stop");
                    break;
            }
        }else{
            switch (pin){
                case global.Sensor.S1.PIN:
                    this.emit("Sensor off","S1");
                    _log.write("Sensor Off "+"S1");
                    break;
                case global.Sensor.S2.PIN:
                    this.emit("Sensor off","S2");
                    _log.write("Sensor Off "+"S2");
                    break;
                case global.Sensor.S3.PIN:
                    this.emit("Sensor off","S3");
                    _log.write("Sensor Off "+"S3");
                    break;
                case global.Sensor.S4.PIN:
                    this.emit("Sensor off","S4");
                    _log.write("Sensor Off "+"S4");
                    break;
                case global.Sensor.S5.PIN:
                    this.emit("Sensor off","S5");
                    _log.write("Sensor Off "+"S5");
                    break;
                case global.Sensor.S6.PIN:
                    this.emit("Sensor off","S6");
                    _log.write("Sensor Off "+"S6");
                    break;
                case global.Sensor.SM.PIN:
                    this.emit("Sensor off","SM");
                    _log.write("Sensor Off "+"SM");
                    if(this.SM==true){
                        this.emit("Sensor off","SM");
                        _log.write("Sensor Off "+"SM");
                        this.SM=false
                    }
                    break;
                case global.Pulso.P1.PIN:
                    if(this.P1==true){
                        this.emit("Input off","P1");
                        _log.write(" Off "+"P1");
                        this.P1=false
                    }
                    break;
                case global.Pulso.P2.PIN:
                    if(this.P2==true){
                        this.emit("Input off","P2");
                        _log.write(" Off "+"P2");
                        this.P2=false
                    }
                    break;
                case global.Pulso.P3.PIN:
                    if(this.P3==true){
                        this.emit("Input off","P3");
                        _log.write(" Off "+"P3");
                        this.P3=false
                    }
                    break;
                case global.Pulso.P4.PIN:
                    if(this.P4==true){
                        this.emit("Input off","P4");
                        _log.write(" Off "+"P4");
                        this.P4=false
                    }
                    break;
                case global.Pulso.P5.PIN:
                    if(this.P5==true){
                        this.emit("Input off","P5");
                        _log.write(" Off "+"P5");
                        this.P5=false
                    }
                    break;
                case global.Pulso.P6.PIN:
                    if(this.P6==true){
                        this.emit("Input off","P6");
                        _log.write(" Off "+"P6");
                        this.P6=false
                    }
                    break;
                case global.Aux.A1.PIN:
                    this.emit("Aux Off","A1");
                    break;
                case global.Aux.A2.PIN:
                    this.emit("Aux Off","A2");
                    break;
                case global.Card.Int.PIN:
                    this.emit("Card Off","Int");
                    break;
                case global.Card.Out.PIN:
                    this.emit("Card Off","Out");
                    break;
                case global.elevator.Up.PIN:
                    this.emit("elevator On","Up");
                    _log.write(" Off "+"UP");
                    break;
                case global.elevator.Down.PIN:
                    this.emit("elevator On","Down");
                    _log.write(" Off "+"Down");
                    break;
                case global.general.stop.PIN:
                    this.emit("Stop","off");
                    _log.write(" Off  "+"Stop");
                    break;
            }
        }

    }

}
