import _log from "@ci24/ci-logmodule";
import global from'./Global';
import _async from 'async';
import MCP23017 from "node-mcp23017_with_i2c_updated";
import event from 'events';
import {callback, mux} from "./Interfaces";
import rpio  from 'rpio';

//let folderLogs = "/free/CI24/Logs/Machine/";
//_log.init(folderLogs);

export class Output extends event.EventEmitter {
    constructor() {
        super();
    }
    private mcp = new MCP23017({
        address: 0x20,
        device: '/dev/i2c-1',
        debug: true
    });
    private mcp1 = new MCP23017({
        address: 0x21,
        device: '/dev/i2c-1',
        debug: true
    });

    private column:any='';


    public InitOut= (cb:callback):void=> {
            try {
                _async.parallel([
                    this.InitOut1,
                    this.InitOut2,
                ],  (err:any|null,result?:any) =>{
                    _log.write(err+result);
                });
            }catch(e) {
                global.result.EXCEPTION.stack=e.stack;
                _log.error(JSON.stringify(global.result.EXCEPTION));
                cb(global.result.EXCEPTION);
            }
    };
    private InitOut1 = (cb:callback)=> {
        try {
            for (let i = 0; i < 16; i++) {
                this.mcp.pinMode(i, this.mcp.OUTPUT);
            }
            cb(null,"inicialización A y B exitosa");
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            _log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    private InitOut2= (cb:callback) =>{
        try {
            for (let i = 0; i < 16; i++) {
                this.mcp1.pinMode(i, this.mcp1.OUTPUT);
            }
            cb(null,"inicialización B, C y D exitosa");
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            _log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    private Select_Colunm= (column:string) =>{
        try {
            _log.write(column+typeof(column));
            _async.mapSeries(global.MCP_Columna,(Columna:any,cb:callback)=>{
                if(Columna.ID.toString()==column){
                    this.column=Columna;
                    _log.write('igual'+Columna)
                }
                _log.write(this.column+typeof(this.column));
                cb(null);
            },(err:any,data?:any)=>{
                this.column.status=true;
                this.ChangeOutputStatus(this.column);
            });
        }catch(e) {
            _log.error(e.stack+'error seleccionando columna' );
        }
    };
    private Select_Colunm_low= (column:string) =>{
        try {
          //  _log.write(column+typeof(column));
            _async.mapSeries(global.MCP_Columna,(Columna:any,cb:callback)=>{
                if(Columna.ID.toString()==column){
                    this.column=Columna;
                    _log.write('igual'+Columna)
                }
                _log.write(this.column+typeof(this.column));
                cb(null);
            },(err:any,data?:any)=>{
                this.column.status=false;
                this.ChangeOutputStatus(this.column);
            });
        }catch(e) {
            _log.error(e.stack+'error seleccionando columna' );
        }
    };
    public HIGH = (data:string,cb:callback) =>{
            try {
                let pin=Array.from(data);
                if(pin.length>2){
                    cb("dato incorrecto");
                }else{
                    switch (pin[0]){
                        case 'a':
                        case 'A':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.A.status=true;
                            this.ChangeOutputStatus(global.MCP_row.A);
                            cb(null,"pin activo");
                            break;

                        case 'b':
                        case 'B':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.B.status=true;
                            this.ChangeOutputStatus(global.MCP_row.B);
                            cb(null,"pin activo");
                            break;
                        case 'c':
                        case 'C':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.C.status=true;
                            this.ChangeOutputStatus(global.MCP_row.C);
                            cb(null,"pin activo");
                            break;

                        case 'd':
                        case 'D':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.D.status=true;
                            this.ChangeOutputStatus(global.MCP_row.D);
                            cb(null,"pin activo");
                            break;
                        case 'e':
                        case 'E':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.E.status=true;
                            this.ChangeOutputStatus(global.MCP_row.E);
                            cb(null,"pin activo");
                            break;
                        case 'f':
                        case 'F':
                            this.Select_Colunm(pin[1]);
                            global.MCP_row.F.status=true;
                            this.ChangeOutputStatus(global.MCP_row.F);
                            cb(null,"pin activo");
                            break;

                        default:
                            cb("dato incorrecto");
                    }
                }
            }catch(e) {
                _log.error("Error al activar pin"+e);
                cb("Error al activar pin");
            }
    };
    public LOW = (data:string,cb:callback) =>{
        try {
            let pin=Array.from(data);
            if(pin.length>2){
                cb("dato incorrecto");
            }else{
                switch (pin[0]){
                    case 'a':
                    case 'A':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.A.status=false;
                        this.ChangeOutputStatus(global.MCP_row.A);
                        cb(null,"pin activo");
                        break;

                    case 'b':
                    case 'B':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.B.status=false;
                        this.ChangeOutputStatus(global.MCP_row.B);
                        cb(null,"pin desactivado");
                        break;
                    case 'c':
                    case 'C':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.C.status=false;
                        this.ChangeOutputStatus(global.MCP_row.C);
                        cb(null,"pin desactivado");
                        break;

                    case 'd':
                    case 'D':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.D.status=false;
                        this.ChangeOutputStatus(global.MCP_row.D);
                        cb(null,"pin desactivado");
                        break;
                    case 'e':
                    case 'E':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.E.status=false;
                        this.ChangeOutputStatus(global.MCP_row.E);
                        cb(null,"pin desactivado");
                        break;
                    case 'f':
                    case 'F':
                        this.Select_Colunm_low(pin[1]);
                        global.MCP_row.F.status=false;
                        this.ChangeOutputStatus(global.MCP_row.F);
                        cb(null,"pin desactivado");
                        break;

                    default:
                        cb("dato incorrecto");
                }
        }
        }catch(e) {
            _log.error("Error al activar pin"+e);
            cb("Error al activar pin");
        }
    };

    public  ChangeOutputStatus = (data:any):void=> {
        try {
            switch (data.MCP) {
                case 1:
                    _log.write("output: "+ data.value+"   status:"+ data.status+'  '+data.text);
                    this.mcp.digitalWrite(data.value, data.status);
                    break;
                case 2:
                    _log.write("output: "+ data.value+"   status:"+ data.status+'  '+data.text);
                    this.mcp1.digitalWrite(data.value, data.status);
                    break;

            }
        } catch (err) {
            _log.error(err.toString.stack);
        }
    };
    public motorDown= (cb:callback) =>{
        try {
            global.MCP_Motor.UP.status     = false;
            global.MCP_Motor.Down.status  = true;
            global.MCP_Motor.ENABLE.status= true;


            this.ChangeOutputStatus(global.MCP_Motor.Down);
         //   this.ChangeOutputStatus(global.MCP_Motor.ENABLE);
            this.ChangeOutputStatus(global.MCP_Motor.UP);

            cb(null,"ascensor bajando");

        }catch(e) {
            _log.error("Error al subir ascensor"+e.stack);
            cb("Error al subir ascensor");
        }
    };


    public motorUP= (cb:any)=> {
        try {
            global.MCP_Motor.UP.status    = true;
            global.MCP_Motor.Down.status  = false;
            global.MCP_Motor.ENABLE.status= true;
            this.ChangeOutputStatus(global.MCP_Motor.UP);
         //   this.ChangeOutputStatus(global.MCP_Motor.ENABLE);
            this.ChangeOutputStatus(global.MCP_Motor.Down);


            cb(null,"ascensor Subiendo  ");

        }catch(e) {
            _log.error("Error al bajar ascensor"+e.stack);
            cb("Error al bajar ascensor");
        }
    };
    public init_enable=(cb:any)=> {
        try {

            global.MCP_Motor.ENABLE.status= false;
            this.ChangeOutputStatus(global.MCP_Motor.ENABLE);

            cb(null,"inicializa enable");

        }catch(e) {
            _log.error("Error al enable"+e.stack);
            cb("Error al enabl");
        }
    };

    public motoroff=(cb:any)=> {
        try {
            global.MCP_Motor.UP.status     = false;
            global.MCP_Motor.Down.status  = false;
            global.MCP_Motor.ENABLE.status= false;
            this.ChangeOutputStatus(global.MCP_Motor.UP);
            this.ChangeOutputStatus(global.MCP_Motor.Down);
           // this.ChangeOutputStatus(global.MCP_Motor.ENABLE);

            cb(null,"ascensor apagado");

        }catch(e) {
            _log.error("Error al bajar ascensor"+e.stack);
            cb("Error al apagar ascensor");
        }
    };

    public stop_all_Pin=(cb:any)=> {
        try {
            _async.mapSeries(global.motoresPiso,(Pisos:any, cb1:callback) =>{
                _async.mapSeries(Pisos, (Motores:any, cb2:callback) =>{
                    setTimeout(()=> {
                        this.LOW(Motores,(err:any)=> {
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
            _log.error("Error al bajar ascensor"+e.stack);
            cb("Error al apagar ascensor");
        }
    };
    public stop_all=(cb:any)=> {
        try {
            _async.series([
                this.motoroff,
               this.stop_all_Pin

            ],  (err, result)=> {
                global.logger.debug('Result: motor y pines apagado  ');
                cb(null, 'ok');

            });

        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            _log.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public timepin= (data:string,time:number,cb:any) =>{
        try {
            this.HIGH(data,(err:any)=> {
               _log.write("avanza"+err)
            });
            setTimeout(()=> {
                    this.LOW(data,function (err:any) {
                        _log.write("detiene"+err)
                    });
                    cb(null,"funciona")
                } ,time)

        }catch(e) {
            _log.error("falla prueba de tiempo ");
            cb(null,"falla")
        }
    };


}
