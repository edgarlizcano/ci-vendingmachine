import _log from "@ci24/ci-logmodule";
import global from'./Global';
import event from 'events';
import async from 'async'
import {Output} from './Output'
import {callback} from "./Interfaces";

let out1  =  new Output();
//let folderLogs = "/free/CI24/Logs/Machine/";

//_log.init(folderLogs);

export class Testfile extends event.EventEmitter {
    constructor() {
        super();
        out1.InitOut( (err: any)=> {
            _log.write("Se inician salidas Mcp"+err)
        });

    }
    private Out1:    any    = out1;
    private state: number    = 0;


    public Testmotores=(cb:callback)=> {
        try {
            async.mapSeries(global.motoresPiso,(Pisos:any, cb1:callback) =>{
                async.mapSeries(Pisos, (Motores:any, cb2:callback) =>{
                    setTimeout(()=> {
                        this.Out1.timepin(Motores,3000, (err:any)=> {
                            _log.write(Motores);
                            cb2(err,"bien");
                        })
                    } ,1000)
                }, function (err:any,res?:any) {
                        cb1(err, res);
                })
            }, function (err:any,res?:any) {
                    cb(err, res);
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            _log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public TestmotoresPiso= (Piso:string,cb:callback) =>{
        try {
            async.mapSeries(global.motoresPiso[Piso],(Motores:any, cb1:callback)=> {
                setTimeout(()=> {
                    this.Out1.timepin(Motores,3000, (err:any,data?:any)=> {
                        _log.write(Motores+'Time Pin');
                        cb1(err,data);
                    })
                } ,1000)

            },  (err:any)=> {
                cb(err, "OK");
            })
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            _log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };




}