import _log from "@ci24/ci-logmodule";
import event from 'events';
import {callback} from "./Interfaces";
import _async from 'async';
let _reader = require('@ci24/ci-readersl025');
import {Mux_class} from "./Mux_class";

export class Reader extends event.EventEmitter {
    constructor() {
        super();
    }
    private Reader = new _reader();
    private Mux = new Mux_class();
    public Open_Port =(data:any, cb:callback)=> {
        try {
            this.Reader.Open_Port(data, function (res:any|null) {
                if(res === null){
                    cb(null)
                }else{
                    _log.write("error abriendo puerto ")
                }
            });
        }catch(err)
        {
            _log.error("Exception:{0}"+err.toString());
            cb(err);
        }
    };
///*****************************************************************************
/////////////////////////////////////CheckReader///////////////////////////////
//*****************************************************************************
    public CheckReader = (data:any, cb:callback)=> {
        try {
            _async.series([
                    _async.apply(this.Mux.SetReader, null),
                    _async.apply(this.Reader.CheckDevice, data)
                ], (err:any|null,result?:any):void=>{
                    if(err === null)
                    {
                        cb(null, result)
                    }
                    else
                    {
                        cb(err);
                    }
                }
            );
        }
        catch (err) {
            _log.error("Exception:{0}"+ err.toString()+err.stack);
            cb(err);
        }
    };
    //*****************************************************************************
/////////////////////////////////////WriteCard///////////////////////////////
//*****************************************************************************
    public WriteCard = (data:any, cb:callback)=> {
        try {
            _log.write('numReader:'+ data.numReader+'sector:'+ data.sector+'block:'+data.numBlocks);
            _async.series([
                    _async.apply(this.Mux.SetReader, null),
                    _async.apply(this.Reader.WriteCard, data)
                ], (err:any|null,result?:any):void=>{
                    if(err === null)
                    {
                        cb(null, result[1])
                    }
                    else
                    {
                        cb(err);
                    }
                }
            );
        }
        catch (err) {
            _log.write("Exception:{0}"+ err.toString(), _log.level.ERROR);
            cb(err);
        }
    };

//*****************************************************************************
/////////////////////////////////////ReadCard///////////////////////////////
//*****************************************************************************
    public ReadCard = (data:any, cb:callback)=> {
        try {
            _log.write('numReader:'+ data.numReader+'sector:'+ data.sector+'block:'+data.numBlocks);
            _async.series([
                    _async.apply(this.Mux.SetReader, null),
                    _async.apply(this.Reader.ReadCard, data)
                ], (err:any|null,result?:any):void=>{
                    if(err === null)
                    {
                        cb(null, result[1])
                    }
                    else
                    {
                        cb(err);
                    }
                }
            );
        }
        catch (err) {
            _log.write("Exception:{0}"+ err.toString(), _log.level.ERROR);
            cb(err);
        }
    };
    ////*****************************************************************************
/////////////////////////GetIdCard1////////////////////////////////////7
//*****************************************************************************
    public GetIdCard = (cb:callback)=> {
        try {
            _async.series([
                    _async.apply(this.Mux.SetReader, null),
                    _async.apply(this.Reader.GetIdCard, null)
                ],(err:any|null,result?:any)=> {
                    if(err === null)
                    {
                        _log.write('Resultado de funcion IdCard:{0}'+(JSON.stringify(result)));
                        cb(null, result[1])
                    }
                    else
                    {
                        cb(err);
                    }
                }
            );
        }
        catch (err) {
            _log.write("Exception:{0}"+err.toString(), _log.level.ERROR);
            cb(err);
        }
    };




}
