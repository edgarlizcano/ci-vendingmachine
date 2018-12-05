import _log from "@ci24/ci-logmodule";
import event from 'events';
import {callback,mux} from "./Interfaces";
import rpio  from 'rpio';
import global from "./Global";
import {Output} from "./Output";
let _Output= new Output();
//let folderLogs = "/free/CI24/Logs/Machine/";
//_log.init(folderLogs);
export class Mux_class extends event.EventEmitter {
    constructor() {
        super();
    }
    private readermux:mux={
        valueMux1:false,
        valueMux2:false
    };
    private sensormux:mux={
        valueMux1:true,
        valueMux2:false
    };
    private _out = _Output;

    public SetReader=(tx:null,cb:callback)=>{
        _log.write('Haciendo que la comunicacion de la lectora se active');
        global.mux.Mux_1.status=this.readermux.valueMux1;
        global.mux.Mux_2.status=this.readermux.valueMux2;
        this._out.ChangeOutputStatus(global.mux.Mux_1);
        this._out.ChangeOutputStatus(global.mux.Mux_2);
     /*   rpio.write(global.mux.Mux_1.value, this.readermux.valueMux1);
        rpio.write(global.mux.Mux_2.value, this.readermux.valueMux2);*/
      /*  rpio.write(global.mux.Mux_1.value, this.sensormux.valueMux1);
        rpio.write(global.mux.Mux_2.value, this.sensormux.valueMux2);*/
        cb(null, 'setReader');
    };
    public SetSensor=(tx:null,cb:callback)=>{
        _log.write('Haciendo que la comunicacion del sensor se active');
        global.mux.Mux_1.status=this.sensormux.valueMux1;
        global.mux.Mux_2.status=this.sensormux.valueMux2;
        this._out.ChangeOutputStatus(global.mux.Mux_1);
        this._out.ChangeOutputStatus(global.mux.Mux_2);
     /*   rpio.write(global.mux.Mux_1.value, this.sensormux.valueMux1);
        rpio.write(global.mux.Mux_2.value, this.sensormux.valueMux2);*/
        cb(null, 'setReader');
    };


}
