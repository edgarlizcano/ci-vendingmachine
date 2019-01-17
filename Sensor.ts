import _log from "@ci24/ci-logmodule";
import event from 'events';
import {callback} from "./Interfaces";
import {ProcessDataSensor} from "./ProcessDataSensor";
import {Mux_class} from "./Mux_class";
import _async from "async";

export class Sensor extends event.EventEmitter {
    constructor() {
        super();
       setTimeout(()=>{
           this.Check_Sensor(this.data, (err: any, dta?: any) => {
               _log.write('err' + err);
               if(err == null){
                   this.isCheck=true;
                   /*let intervalGoLevel: any = setInterval(() => {
                       this.Get_state((err:any,dta?:any)=>{})
                   }, 2000);*/
               }
           });
       },3000);
    }
    private Sensorcomand = new ProcessDataSensor();
    private Mux          = new Mux_class();
    private data={
        port:'/dev/ttyAMA0',
        baudRate:9600
    };
    public isCheck: any = false;
    public Check_Sensor=( data:any,callback:callback)=> {
        try{
            _async.series([
                _async.apply(this.Mux.SetSensor,null),
                _async.apply(this.Sensorcomand.CheckPortOpen,data),

            ],(err:any)=>{
                callback(err)
            });

        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };

    public Get_state=( callback:callback)=> {
        try{
            _async.series([
                _async.apply(this.Mux.SetSensor,null),
                _async.apply(this.Sensorcomand.SendComand,null),

            ],(err:any)=>{
                callback(err)
            });

        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };
    public Open_port=(data:any, callback:callback)=> {
        try{
            _async.series([
                _async.apply(this.Mux.SetSensor,null),
                _async.apply(this.Sensorcomand.Open_port,data),

            ],(err:any)=>{
                callback(err)
            });

        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };

}
