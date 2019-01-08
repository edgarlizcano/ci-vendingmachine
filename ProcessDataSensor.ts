import _log from "@ci24/ci-logmodule";
import event from 'events';
let _serial = require('@ci24/ci-serialmanager');
import {Serial_Sensor} from "./Serial_Sensor";
import {callback} from "./Interfaces";
import _async from 'async';

export class ProcessDataSensor extends event.EventEmitter {
    constructor() {
        super();
        _serial.Event().on('serialData', this.EventSerialData)
    }
    private serialdata  = new Serial_Sensor();
    private buffer      = new Buffer(0);
    private reference   : any       = null;
    private array       : any       = [];
    private array1      : any       = [];
    private res         = [];
    private long        :number     = 0;
    private CRC         :any;
    private state       :any        =1;
    private BufferIn    :any;
    private ReadyData   :boolean    =false;

    private Trama_IN   = [0xAA, 0x01, 0x01, 0x00, 0xBB];
    private Trama_POOL = [0xAA, 0x10, 0x01, 0x11, 0xBB];
    private Trama_STATE= [0xAA, 0x32, 0x01, 0x33, 0xBB];
    private baudRate=0;
    private port=0;

    public CheckPortOpen = (data:any, cb:callback) => {
        try {
            _log.write("port:{0}:baudRate:{1} "+data.port, data.baudRate);
            if(data.port.length > 0)
            {
                this.port=data.port;
            }

            if(data.baudRate > 0)
            {
               this.baudRate = data.baudRate;
            }

            this.check_open_port(null,(check, cmdOk)=>
                {
                    _log.write("check:{0}:cmdOk:{1}"+check, cmdOk);
                    if(!check)
                    {
                        if(cmdOk == false)
                        {
                            _log.write("send cmd...");
                          let trama =[0xAA, 0x10, 0x01, 0x11, 0xBB];
                            //let trama =[0xAA, 0x01, 0x01, 0x00, 0xBB];
                            _serial.EnviarComando(trama);
                            cb(null, {port: this.port});

                        }
                        else
                        {
                            cb(null, {port: this.port});
                        }
                    }
                    else
                    {
                        cb('error del puerto');
                    }
                }
            );
        }
        catch (exception) {
            _log.error("Exception" + exception);
            cb(exception);
        }
    };

    private check_open_port= (data:any,callback:callback) => {
        try {
            if(_serial.isOpen())
            {
                callback(null, false);;
            }else {
                _log.write("port close...");
                let trama = [0xAA, 0x10, 0x01, 0x11, 0xBB];
                let portRestricted = new Array();
                _log.write("trama 1:{0}"+ JSON.stringify(trama));
                _serial.buscarPuerto(trama, this.baudRate, this.port, portRestricted, (check:any, data:any, port:any)=>
                {
                    _log.write("check:{0}"+check);
                    if (check == true)
                    {
                        _log.write("port:{0}"+port);
                        this.port = port;
                        callback(null, true);
                    }
                    else
                    {
                        this.port = port;
                        callback('error abriendo puerto');
                    }
                });
            }
        }
        catch (exception) {
            _log.error("Exception" + exception);
            callback(exception);

        }
    };

    public Open_port = (data:any, callback:callback) => {
        try {
            if(_serial.isOpen())
            {
                callback(null, {executeCmd: false});
            }else {
                _log.write("port close...");

                _serial.AbrirPuerto( data.port,data.baudRate,   (check:any,port:any)=>
                {
                    _log.write("check:{0}"+check);
                    if (check == true)
                    {
                        _log.write("port:{0}"+port);

                        callback(null, {executeCmd: true});
                    }
                    else
                    {
                        callback('no se pudo abrrir puerto');
                    }
                });
            }
        }
        catch (exception) {
            _log.error("Exception" + exception);
            callback(exception);

        }
    };

    private EventSerialData = (data:any) => {
        try {

             this.buffer = Buffer.concat([this.buffer,data]);
            if (this.reference != null) {
                clearTimeout(this.reference);
            }

            for (let i = 0; i < this.buffer.length; i++) {
                this.array.push(this.buffer[i]);
            }
            this.reference = setTimeout(() => {
                this.buffer = new Buffer(0)
              //  this.array1=this.array.slice(this.array.indexOf(0xcc), this.array.indexOf(0xbb));
                _log.write("Dato Recibido------>>    " + JSON.stringify(this.array));
                this.Validate((err,data)=>{
                    if(err==null){
                        this.ReadyData = true;
                        this.state=1;
                        this.BufferIn = this.array;
                        this.array1=this.array;
                        this.array=[];

                    }else{
                        this.ReadyData = true;
                        this.state=0;
                        this.BufferIn = data;
                        this.array1=this.array;
                        this.array=[];
                    }
                })

            }, 250);
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
        }
    };

    private Validate=( callback:callback)=> {
        try{
          //  this.array = [];
          //  this.array = data;

            this.CRC =this.CRC_Vending_Machine(this.array);
            if(this.CRC==this.array[this.array.length-2]){
                _log.write('Crc correcto');
                callback(null,'CRC correcto')
            }else{
                _log.error('Crc incorrecto');
                callback('CRC incorrecto',this.array);
            }
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };

    private CRC_Vending_Machine=(data:any):any=> {
        try{
            let crc = 0;
           // _log.write(JSON.stringify(data));
            this.long = (data.length - 2);
            for (let i = 1; i < this.long; i++) {
                crc ^= data[i];
            }

            return crc;
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);

        }
    };

    public SendComand=(txt:null,cb:callback):void=> {
        try{
            _async.series([
                _async.apply(this.SendComand_,this.Trama_STATE),
                _async.apply(this.POOLSTATE,null),

            ],(err:any)=>{
                cb(err);
            });
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);

        }
    };

    public SendComand_check=(txt:null,cb:callback):void=> {
        try{
            _async.series([
                _async.apply(this.check_open_port,null),
                _async.apply(this.SendComand_,this.Trama_POOL),
                _async.apply(this.POOLSTATE,null),

            ],(err:any)=>{
                cb(err);
            });
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);

        }
    };

    private SendComand_=(trama:any,cb:callback):void=> {
        try{
            this.ReadyData = false;
            setTimeout(()=>{
                _serial.EnviarComando(trama);
            },500);

            cb(null);
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);

        }
    };

    private POOLSTATE = (data:null,callback:callback) => {
        try {
            let Interval: any = null;
             Interval = setInterval( ()=> {
                 if (Interval != null)
                 {   Interval = null;
                     clearInterval(Interval);

                     _log.write("POLL HABILITADO");
                     this.waitForReadyData(3000,  (err:any,data?:any) =>{
                         if (data.Check === true) {
                             this.serialdata.POLLSTATEDATA(this.array1,data.state, (err:any, data?:any)=> {
                                 if (err==null) {
                                     callback(null, data);
                                     this.array1=[];
                                 } else {
                                     callback(err);
                                     this.array1=[];
                                 }
                             })
                         } else {
                             _log.write("Se Agoto el tiempo de espera");
                             clearInterval(Interval);
                             Interval = null;
                             callback("Error Device No Connected");                    }
                     })
                 }
            }, 500);
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);

        }
    };

    private  waitForReadyData(timeout:number, cb:callback) {
        try {
            this.BufferIn = new Array(0);
            let count = 0;
            let interval = setInterval(()=> {
                if (this.ReadyData) {
                    count = 0;
                    clearInterval(interval);
                    let resp ={
                        Check: true,
                        state:this.state
                    };
                    cb(null,resp);
                } else {
                    count += 100;
                    if (count >= timeout) {
                        count = 0;
                        clearInterval(interval);
                        let resp ={
                            Check: false
                        };
                        cb(null,resp);
                    }
                }
            }, 100)
        } catch (exception) {
            _log.error("Exception: {0}"+exception.stack);
        }
    };
}
