import _log from "@ci24/ci-logmodule";
import event from 'events';
import {callback} from "./Interfaces";
import Maps from './ConfigMachine';

export class Serial_Sensor extends event.EventEmitter {
    constructor() {
        super();
    }
    public POLLSTATEDATA = (BufferIn:any,state:number, callback:callback) => {
        try {
            if(state==1){
              //  _log.write('se recibe trama para revisar'+JSON.stringify(BufferIn));
                switch (BufferIn[2]){
                    case 0x01:
                    case '01':
                        this.Resp_Check(BufferIn,(err,data)=>{
                            callback(err,data);
                        });
                        break;
                    case 0x02:
                    case '02':
                        this.command_2(BufferIn,(err,data)=>{
                            callback(err,data);
                        });
                        break;
                    case 0x04:
                    case '04':
                        this.Process_state(BufferIn,(err,data)=>{
                            callback(err,data);
                        });
                        break;

                    default:
                        _log.write('Trama no identificada ----->'+JSON.stringify(BufferIn));
                        callback(null,'Trama no identificada');
                        break;
                }
            }else{
                _log.error('CRC incorrecta,   Longitud de trama=  '+BufferIn.length+'    Respuesta incorrecta');
                //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                callback('trama incorrecta');
            }
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }

    };
    private Resp_Check = (BufferIn:any, callback:callback) => {
        try {
          if(BufferIn[0]==0xcc&&BufferIn[BufferIn.length-1]==0xbb){
              _log.write('Inicio y fin de trama correcto de check Sensores'+'CRC correcto,   Longitud de trama=  '+BufferIn.length);
                    if(BufferIn[1]==0x10){
                        //_log.write('Trama respuesta check ----->'+JSON.stringify(BufferIn));
                        callback(null,'ok');
                    }else{
                        //_log.error('respuesta de check desconocida----->'+JSON.stringify(BufferIn));
                        callback(null,'ok');
                    }
          }else{
              _log.error('Respuesta incorrett,   Longitud de trama=  '+BufferIn.length+'    aparecte respuesta de check');
              //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
              callback('Respuesta incorrett');
          }
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };
    private command_2 = (BufferIn:any, callback:callback) => {
        try {
            if(BufferIn[0]==0xcc&&BufferIn[BufferIn.length-1]==0xbb){
                _log.write('Inicio y fin de trama correcto de comand 2 Sensores'+'CRC correcto,   Longitud de trama=  '+BufferIn.length);
                if(BufferIn[1]==0x8a){
                    _log.write('Trama respuesta command 2----->'+JSON.stringify(BufferIn));
                    callback(null,'ok');
                }else if(BufferIn[1]==0x9b){
                    _log.error('Trama respuesta command 2 ----->'+JSON.stringify(BufferIn));
                    callback('al parecer no se ha habilitado la comunicacion con el comando pool');
                }else{
                    _log.error('respuesta de command 2 desconocida----->'+JSON.stringify(BufferIn));
                    callback(null,'ok');
                }
            }else{
                _log.error('Respuesta incorrett,   Longitud de trama=  '+BufferIn.length+'    aparecte respuesta de check');
                //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                callback('Respuesta incorrett');
            }
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };
    private Process_state = (BufferIn:any, callback:callback) => {
        try {
            if(BufferIn[0]==0xcc&&BufferIn[BufferIn.length-1]==0xbb){
                _log.write('Inicio y fin de trama correcto de estado de sensores'+'CRC correcto, Longitud de trama='+BufferIn.length);
                if(BufferIn[3]==0x33){
                    if(BufferIn[4]>0xf0){
                        _log.warning('esta desocupada----->'+JSON.stringify(BufferIn));
                        Maps.Is_empty=true;
                        callback(null,'');
                    }else{
                        _log.fatal('esta ocupada----->'+JSON.stringify(BufferIn));
                        callback(null,'ok');
                        Maps.Is_empty=false;
                    }
                }else{
                    _log.error('respuesta de state desconocida----->'+JSON.stringify(BufferIn));
                    callback('respuesta de state');
                }
            }else{
                _log.error('Respuesta incorrett,   Longitud de trama=  '+BufferIn.length+'    aparecte respuesta de check');
                //_log.error('Trama  ----->'+JSON.stringify(BufferIn));
                callback('Respuesta incorrett,');
            }
        }
        catch (exception) {
            _log.error("Exception" + exception.stack);
            callback(exception);
        }
    };
}
