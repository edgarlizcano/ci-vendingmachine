import _log from "@ci24/ci-logmodule";
import event from 'events';
import {Testfile} from './Testfile';
import {Shop} from './Shop';
import {callback, EventFormat} from "./Interfaces";
import {Output} from './Output'
import global from'./Global';
let out1  =  new Output();
import {Reader} from './Reader';
import {Sensor} from "./Sensor";
import {Logger} from "ci-syslogs";
let Log = new Logger("0.0.0.0",Logger.Facilities.Machine);
let folderLogs = "/free/CI24/Logs/Machine/";
let data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "oto245.log",
    "level": "INFO"
};

_log.init(data)

export class Main extends event.EventEmitter{
    constructor() {
        super();
    this.state_Machine=global.State_Machine.No_task;
    }
    private Test    = new Testfile();
    private _Sensor = new Sensor();
    private Compra  = new Shop(this);
    private _Reader = new Reader();
    private Out_   :any=out1;
    public state_Machine:number;
    public Is_init_location:boolean=false;

    public Is_empty:boolean=true;

    public Up_elevator=(cb:callback):void=>{
        try {
            this.Out_.motorUP(function (err:any,data?:any) {
                cb(err,data);})
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Down_elevator=(cb:callback):void=>{
        try {
            this.Out_.motorDown(function (err:any,data?:any) {
                cb(err,data);})
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public off_elevator=(cb:callback):void=>{
        try {
            this.Out_.motoroff(function (err:any,data?:any) {
                cb(err,data);})
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    public Testmotores=(cb:any) :void=>{
        try{
            this.Test.Testmotores( (err:any,data?:any)=> {
                    cb(err,data);
            })
        }catch(e){
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public TestmotoresPiso= (Piso:string,cb:any):void =>{
        try {
            this.Test.TestmotoresPiso(Piso,(err:any,data?:any)=> {
                    cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    public GotoLevel=(data:string,cb:any):void =>{
        try {
            _log.write('main Gotolevel');
            this.Compra.GotoLevel(data,(err:any,data?:any)=> {
                    cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };

    public Sale=(data:string,cb:any):void=> {
        try {
            this.Compra.Sale(data,function (err:any,data?:any) {
                    cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };
    public Sale_big=(data:string,cb:any):void=> {
        try {
            this.Compra.Sale_big(data,function (err:any,data?:any) {
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };
    public Close =(cb:any):void=> {
        try {
            this.Compra.Close((err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };
    public Open =(cb:any):void=> {
        try {
            this.Compra.Open_((err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };
    public Time_pin=(data:string,cb:any):void=> {
        try {
            this.Out_.timepin(data,10000,(err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Open_Port=(data:any,cb:any):void=> {
        try {
            this._Reader.Open_Port(data,(err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public CheckReader=(data:any,cb:any):void=> {
        try {
            this._Reader.CheckReader(data,(err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    public GetIdCard=(cb:any):void=> {
        try {
            this._Reader.GetIdCard((err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    public Check_Sensor=(data:any,cb:any):void=> {
        try {
            this._Sensor.Check_Sensor(data,(err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Open_port=(data:any,cb:any):void=> {
        try {
            this._Sensor.Open_port(data,(err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Get_state=(cb:any):void=> {
        try {
            this._Sensor.Get_state((err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Is_dispensing=(data:any):void=> {
        try {
            let result:EventFormat={
                cmd:'Ok_dispensing',
                data:data
            };
            this.emit('Event',result);
            Log.LogDebug('emitiendo evento de recoger producto')
            //_log.debug('emitiendo evento de recoger producto')
        }catch(e) {
            Log.LogError(e.stack+"Error al obtener el estado del sensor");
            //_log.error(e.stack+"Error al obtener el estado del sensor");

        }
    };
    public Is_busy=(data:any):void=> {
        try {
            let result:EventFormat={
                cmd:'Busy',
                data:data
            };
            this.emit('Event',result);
            Log.LogDebug('emitiendo evento de estado de bandeja inferior');
            //_log.debug('emitiendo evento de estado de bandeja inferior')
        }catch(e) {
            Log.LogError(e.stack+"Error al obtener el estado de bandeja inferior");
            //_log.error(e.stack+"Error al obtener el estado de bandeja inferior");

        }
    };
    public Atasco=():void=> {
        try {
            let result:EventFormat={
                cmd:'-',
                data:''
            };
            this.emit('Event',result);
            Log.LogDebug('emitiendo evento de estado de bandeja inferior');
            //_log.debug('emitiendo evento de estado de bandeja inferior')
        }catch(e) {
            Log.LogError(e.stack+"Error al obtener el estado de bandeja inferior");
            //_log.error(e.stack+"Error al obtener el estado de bandeja inferior");

        }
    };
    public clean_pin=(cb:any):void=> {
        try {
            this.Out_.stop_all((err:any,data?:any) =>{
                cb(err,data);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            Log.LogError(JSON.stringify(global.result.EXCEPTION));
            //_log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

}