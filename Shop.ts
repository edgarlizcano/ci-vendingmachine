//import global.logger from '@ci24/ci-logmodule';
import global from'./Global';
import event from 'events';
import {Output} from './Output'
import {Input} from './Input'
import {callback} from "./Interfaces";
import ProcessEnv = NodeJS.ProcessEnv;
import _async from "async";

//let folderLogs = "/free/CI24/Logs/Machine/";
//global.logger.init(folderLogs);

let out1  =  new Output();


export class Shop extends event.EventEmitter {
    constructor(_principal:any) {
        super();
        global.logger=_principal.log;
        let input =  new Input(_principal);
        input.Open();
        this.Input=input;
        input.on('Sensor On',this.ProcessEnv);
        input.on('Input On',this.ProcessEnv_PIN);
        this.Principal=_principal;
        input.on("elevator On",  (state: string)=> {
            if (state === 'Up') {
                out1.motorUP(function (err: any) {
                    global.logger.warning("motor arriba"+err)
                })
            }else if (state === 'Down') {
                out1.motorDown(function (err: any) {
                    global.logger.warning("motor abajo" + err)
                })
            }

        });
        input.on("Stop",  (state: string)=> {
          global.logger.fatal('stooooooooooopppppjjjadnkafkjfakhagdjbkgakzbnzgfkbjsgjkeskjaekjgskjbsghllbkgf' +
              'haetlkhsdgnlkhgsnklsflngslsg' +
              'ikhgksgklki')
        });
        input.on("elevator Off",  (state: string)=> {
            if (state === 'Up' || state === 'Down') {
                out1.motoroff(function (err: any) {
                    global.logger.fatal("motor apagado"+err);
                })
            }
        });
        input.on("Stop",  (state: string)=> {
            if (state === 'on') {

            }
        });
        input.on("Sensor Off", (pin: string)=> {
           if(pin==='SM'){
               this.Principal.Is_init_location=false;
           }
        })

    }
    private Out1:    any    = out1;
    private Input:   any;

    public  Principal         :any;
    private Is_pin            :string ='';
    private Is_Location       :string ='';
    private PisoA_ON          :number =0;
    private PisoB_ON          :number =0;
    private PisoC_ON          :number =0;
    private PisoD_ON          :number =0;
    private PisoE_ON          :number =0;
    private PisoF_ON          :number =0;
    private Is_sale_error     :boolean =false;
    private Is_emit_event     :boolean=false;

    public ProcessEnv=(Pin:string):void =>{
        try {
            global.logger.debug('Sensor   '+Pin+ '  activo'+'  estado de la maquina :   '+this.Principal.state_Machine);
                 switch (Pin) {
                     case'S1':
                         if (this.Is_pin === 'A' ||this.Is_pin === 'a') {
                            if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {

                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location)
                                 });
                                 this.Ubicacion('2', (err: any) => {
                                     global.logger.write('Enviando a ubicacion ' + this.Is_Location)
                                 });
                             }else if(this.Principal.state_Machine == global.State_Machine.Go_to_finish_location){
                                global.logger.error('dirigiendose a pocisión de dispensar');
                            }else if (this.Principal.state_Machine == global.State_Machine.Go_to_level){
                                this.Out1.motoroff((err: any) => {
                                    if (err == null) {
                                        this.Principal.Is_init_location=false;
                                        global.logger.write('Elevador apagado pagado ');
                                          this.preparing_to_dispense((err: any) => {
                                              if (err == null) {
                                                  global.logger.write('motor preparado para dispensar');
                                                  if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                      this.Principal.state_Machine = global.State_Machine.In_level;
                                                  }

                                              } else {
                                                  global.logger.error(err);
                                              }
                                          });
                                    } else {
                                        global.logger.error('No fue posible detner motor');
                                    }
                                });
                            }else{
                                this.Out1.motoroff((err: any) => {
                                    if (err == null) {
                                        this.Principal.Is_init_location=false;
                                        global.logger.error('Elevador apagado pagado por sensor 1 ');
                                        this.Ubicacion('4', (err: any) => {
                                            global.logger.error('Enviando a ubicacion inical ' + this.Is_Location+err)
                                        });
                                    } else {
                                        global.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                         }else{
                             this.Out1.motoroff((err: any) => {
                                 if (err == null) {
                                     this.Principal.Is_init_location=false;
                                     global.logger.error('Elevador apagado pagado por sensor 1');

                                 } else {
                                     global.logger.error('No fue posible detner motor');
                                 }
                             });
                         }
                         break;
                     case'S2':
                         if (this.Is_pin === 'B' ||this.Is_pin === 'b') {
                             if (this.Principal.state_Machine == global.State_Machine.Go_to_level) {
                                 this.Principal.Is_init_location=false;
                                 this.Out1.motoroff((err: any) => {
                                     if (err == null) {
                                         global.logger.write('Elevador apagado pagado ');
                                         this.preparing_to_dispense((err: any) => {
                                             if (err == null) {
                                                 global.logger.write('motor preparado para dispensar');
                                                 if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                     this.Principal.state_Machine = global.State_Machine.In_level;
                                                 }
                                             } else {
                                                 global.logger.error(err);
                                             }
                                         });
                                     } else {
                                         global.logger.error('No fue posible detner motor');
                                     }
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location)
                                 });
                                 this.Ubicacion('2', (err: any) => {
                                     global.logger.write('Enviando a ubicacion ' + this.Is_Location)
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.No_task) {
                                 global.logger.warning('Sensor 2 activado sin  tarea');
                                 this.Principal.Is_init_location=false;
                             }
                         }
                         break;
                     case'S3':
                         if (this.Is_pin === 'C' ||this.Is_pin === 'c') {
                             if (this.Principal.state_Machine == global.State_Machine.Go_to_level) {
                                 this.Principal.Is_init_location=false;
                                 this.Out1.motoroff((err: any) => {
                                     if (err == null) {
                                         global.logger.write('Elevador apagado pagado ');
                                         this.preparing_to_dispense((err: any) => {
                                             if (err == null) {
                                                 global.logger.write('motor preparado para dispensar');
                                                 if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                     this.Principal.state_Machine = global.State_Machine.In_level;
                                                 }
                                                 global.logger.write('esta en niveeeeeeellllllll'+this.Principal.state_Machine);
                                             } else {
                                                 global.logger.error(err);
                                             }
                                         });
                                     } else {
                                         global.logger.error('No fue posible detner motor');
                                     }
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location+err)
                                 });
                                 this.Ubicacion('2', (err: any) => {
                                     global.logger.write('Enviando a ubicacion ' + this.Is_Location)
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.No_task) {
                                 global.logger.warning('Sensor 3 activado sin  tarea');
                                 this.Principal.Is_init_location=false;
                             }
                         }
                         break;
                     case'S4':
                         if (this.Is_pin === 'D' ||this.Is_pin === 'd') {
                             if (this.Principal.state_Machine == global.State_Machine.Go_to_level) {
                                 this.Principal.Is_init_location=false;
                                 this.Out1.motoroff((err: any) => {
                                     if (err == null) {
                                         global.logger.write('Elevador apagado pagado ');
                                         this.preparing_to_dispense((err: any) => {
                                             if (err == null) {
                                                 global.logger.write('motor preparado para dispensar');
                                                 if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                     this.Principal.state_Machine = global.State_Machine.In_level;
                                                 }
                                             } else {
                                                 global.logger.error(err);
                                             }
                                         });
                                     } else {
                                         global.logger.error('No fue posible detner motor');
                                     }
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location);
                                     this.Ubicacion('2', (err: any) => {
                                         global.logger.write('Enviando a ubicacion ' + this.Is_Location)
                                     });
                                 });

                             } else if (this.Principal.state_Machine == global.State_Machine.No_task) {
                                 global.logger.warning('Sensor 4 activado sin  tarea');
                                 this.Principal.Is_init_location=false;
                             }
                         }

                         break;
                     case'S5':
                         if (this.Is_pin === 'E' ||this.Is_pin === 'e') {
                             if (this.Principal.state_Machine === global.State_Machine.Go_to_level) {
                                 this.Principal.Is_init_location=false;
                                 this.Out1.motoroff((err: any) => {
                                     if (err == null) {
                                         global.logger.write('Elevador apagado pagado ');
                                         this.preparing_to_dispense((err: any) => {
                                             if (err == null) {
                                                 global.logger.write('motor preparado para dispensar');
                                                 if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                     this.Principal.state_Machine = global.State_Machine.In_level;
                                                 }

                                             } else {
                                                 global.logger.error(err);
                                             }
                                         });
                                     } else {
                                         global.logger.error('No fue posible detner motor');
                                     }
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location)
                                 });
                                 this.Ubicacion('2', (err: any) => {
                                     global.logger.write('Enviando a ubicacion ' + this.Is_Location)
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.No_task) {
                                 global.logger.warning('Sensor 5 activado sin  tarea');
                                 this.Principal.Is_init_location=false;
                             }
                         }
                         break;
                     case'S6':
                         if (this.Is_pin === 'F' ||this.Is_pin === 'f') {
                             if (this.Principal.state_Machine == global.State_Machine.Go_to_level) {
                                 this.Principal.Is_init_location=false;
                                 this.Out1.motoroff((err: any) => {
                                     if (err == null) {
                                         global.logger.write('Elevador apagado pagado ');
                                         this.preparing_to_dispense((err: any) => {
                                             if (err == null) {
                                                 if(this.Principal.state_Machine != global.State_Machine.Dispensing_product){
                                                     this.Principal.state_Machine = global.State_Machine.In_level;
                                                 }
                                                 global.logger.write('motor preparado para dispensar');

                                             } else {
                                                 global.logger.error(err);
                                             }
                                         });
                                     } else {
                                         global.logger.error('No fue posible detner motor');
                                     }
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                                 global.logger.write('llega a dispensar producto');
                                 this.Principal.Is_init_location=false;
                                 this.Sale_column_low(this.Is_Location, (err: any) => {
                                     global.logger.write('Apagaaa' + this.Is_Location)
                                 });
                                 this.Ubicacion('2', (err: any) => {
                                     global.logger.write('Enviando a ubicacion ' + this.Is_Location+err)
                                 });
                             } else if (this.Principal.state_Machine == global.State_Machine.No_task) {
                                 global.logger.warning('Sensor 6 activado sin  tarea')
                                 this.Principal.Is_init_location=false;
                             }
                         }

                         break;
                     case'SM':
                          if (this.Principal.state_Machine == global.State_Machine.Go_to_finish_location) {
                             this.Principal.Is_init_location=true;
                             this.Out1.motoroff((err: any) => {
                                 if (err == null) {
                                     this.preparing_to_receive((err:any)=> {
                                         if (err==null){
                                             this.Principal.state_Machine = global.State_Machine.No_task;
                                             global.logger.write('Elevador apagado y en posición de entrega de producto'+err);
                                         }else{
                                             global.logger.error('No fu posible detener el motor luego de preaparar para entregar');

                                         }
                                     });
                                 } else {
                                     global.logger.error('No fue posible preparar para entregarr');
                                 }
                             });
                     }else  if (this.Principal.state_Machine == global.State_Machine.Go_to_Init_location) {
                              this.Principal.Is_init_location=true;
                              this.Out1.motoroff((err: any) => {
                                  if (err == null) {
                                      this.preparing_to_receive((err:any)=> {
                                          if (err==null){
                                              global.logger.write('Elevador apagado pagado y en posición inicial ');
                                              this.Principal.state_Machine = global.State_Machine.Init_location;
                                          }else{
                                              global.logger.error('No fu posible detener el motor luego de preaparar para entregar');

                                          }
                                      });

                                  } else {
                                      global.logger.error(global.result.ERROR_STOP_lOCATION);
                                  }
                              });
                          }
                          else  if (this.Principal.state_Machine == global.State_Machine.Go_to_Init_location_ERROR) {
                              this.Principal.Is_init_location=true;
                              this.Out1.motoroff((err: any) => {
                                  if (err == null) {
                                      this.preparing_to_receive((err:any)=> {
                                          if (err==null){
                                              global.logger.write('Elevador apagado pagado y en posición inicial despues de no dispensar ');
                                              this.Principal.state_Machine = global.State_Machine.No_task;
                                          }else{
                                              global.logger.error('No fu posible detener el motor luego de preaparar para entregar');

                                          }
                                      });

                                  } else {
                                      global.logger.error(global.result.ERROR_STOP_lOCATION);
                                  }
                              });
                          } else {
                         this.Principal.Is_init_location=true;

                     }
                         break;
                 }
            // }
        }catch(e) {
            global.logger.error(e.stack+'Error al procesar evento');

        }
    };


    public Sale=(data:string,cb:callback):void =>{
        try {
            global.Product_is=1;
            this.Is_emit_event=false;
            this.Is_sale_error=false;
            let pin = Array.from(data);

            switch (pin[0]) {
                case 'a':
                case 'A':
                    this.Sale_steps('A',data,(err:any)=>{
                        cb(err, 'Piso A');
                    });
                    this.PisoA_ON=0;
                    break;
                case 'b':
                case 'B':
                    this.Sale_steps('B',data,(err:any)=>{
                        cb(err, 'Piso B');
                    });
                    this.PisoB_ON=0;
                    break;
                case 'c':
                case 'C':
                    this.Sale_steps('C',data,(err:any)=>{
                        cb(err, 'Piso C');
                    });
                    this.PisoC_ON=0;
                    break;

                case 'd':
                case 'D':
                    this.Sale_steps('D',data,(err:any)=>{
                        cb(err, 'Piso D');
                    });
                    this.PisoD_ON=0;
                    break;

                case 'e':
                case 'E':
                    this.Sale_steps('E',data,(err:any)=>{
                        cb(err, 'Piso E');
                    });
                    this.PisoE_ON=0;
                    break;
                case 'f':
                case 'F':
                    this.Sale_steps('F',data,(err:any)=>{
                        cb(err, 'Piso F');
                    });
                    this.PisoF_ON=0;
                    break;
                default:
                    cb('dato incorrecto');
            }
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            global.logger.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };
    public Sale_big=(data:string,cb:callback):void =>{
        try {
            global.Product_is=2;
            this.Is_emit_event=false;
            this.Is_sale_error=false;
            let pin = Array.from(data);

            switch (pin[0]) {
                case 'a':
                case 'A':
                    this.Sale_steps('A',data,(err:any)=>{
                        cb(err, 'Piso A');
                    });
                    this.PisoA_ON=0;
                    break;
                case 'b':
                case 'B':
                    this.Sale_steps('B',data,(err:any)=>{
                        cb(err, 'Piso B');
                    });
                    this.PisoB_ON=0;
                    break;
                case 'c':
                case 'C':
                    this.Sale_steps('C',data,(err:any)=>{
                        cb(err, 'Piso C');
                    });
                    this.PisoC_ON=0;
                    break;

                case 'd':
                case 'D':
                    this.Sale_steps('D',data,(err:any)=>{
                        cb(err, 'Piso D');
                    });
                    this.PisoD_ON=0;
                    break;

                case 'e':
                case 'E':
                    this.Sale_steps('E',data,(err:any)=>{
                        cb(err, 'Piso E');
                    });
                    this.PisoE_ON=0;
                    break;
                case 'f':
                case 'F':
                    this.Sale_steps('F',data,(err:any)=>{
                        cb(err, 'Piso F');
                    });
                    this.PisoF_ON=0;
                    break;
                default:
                    cb('dato incorrecto');
            }
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            global.logger.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    private Sale_U=(location:string,cb:callback)=>{
       let intervaldispensing :any = setInterval(()=>{
            if(this.Principal.state_Machine==global.State_Machine.In_level){
                if (intervaldispensing != null)
                {   intervaldispensing = null;
                    clearInterval(intervaldispensing);

                    this.Sale_column(this.Is_Location,(err:any) =>{
                        global.logger.write('activa venta'+this.Is_Location);
                        cb(err);
                    });
                }
            }else if(this.Principal.state_Machine==global.State_Machine.atasco){
                if (intervaldispensing != null)
                {   intervaldispensing = null;
                    clearInterval(intervaldispensing);


                }
            }
        },100)

    };
    private wait_for_dispensing=()=> {
        let time_wait = global.Time_wait_for_dispensing;
        let settimeout_wait:any  = setTimeout(() => {
            if (intervalwait != null) {
                intervalwait = null;
                clearInterval(intervalwait);
                this.Sale_column_low(this.Is_Location, (err: any) => {
                    global.logger.write('Apagaaa' + this.Is_Location+err)
                });
                this.Ubicacion('3', (err: any) => {
                    global.logger.error('Enviando a ubicacion ' + this.Is_Location+err)
                });
            }
        }, time_wait);
        let intervalwait:any= setInterval(() => {
            if (this.Principal.state_Machine == global.State_Machine.Go_to_finish_location) {
                if (intervalwait != null) {
                    intervalwait = null;
                    clearInterval(intervalwait);
                    clearInterval(settimeout_wait);
                }
            }
        })
    };

    private init_product=(data:any,cb:callback)=>{
        global.logger.fatal('llama a intervalo para dispensar ');
        let intervalproductend :any = setInterval(()=>{
            if(this.Principal.state_Machine == global.State_Machine.No_task){
                if (intervalproductend != null)
                {   intervalproductend = null;
                    clearInterval(intervalproductend);
                    if(this.Is_sale_error==false){
                        cb(null);
                        if(this.Is_emit_event==false){
                            this.Principal.Is_dispensing(true);
                            this.Is_emit_event=true;
                        }
                    }else{
                        cb('no hay producto a dispensar');
                        if(this.Is_emit_event==false){
                            this.Principal.Is_dispensing(false);
                            this.Is_emit_event=true;
                        }
                    }
                }
            }
        },100)
    };
    private wait_for_up=(data:any)=>{
        let time_wait= global.Time_wait_for_up_level;
        if(data!==null){
           time_wait= data;
        }

        let settimeout_wait=setTimeout(()=>{
            if (intervalwait != null)
            {   intervalwait = null;
                clearInterval(intervalwait);
                global.logger.fatal('tiempo excedido afuera ');
                if(this.Principal.state_Machine == global.State_Machine.Go_to_level||this.Principal.state_Machine == global.State_Machine.Go_to_Init_location || this.Principal.state_Machine == global.State_Machine.Go_to_finish_location || this.Principal.state_Machine == global.State_Machine.Go_to_Init_location_ERROR){
                    global.logger.fatal('tiempo excedido');
                    this.Principal.Atasco();
                    this.Principal.state_Machine=global.State_Machine.atasco;
                    this.Principal.Is_init_location=false;
                    this.Out1.motoroff( (err:any) =>{
                        if (err==null){
                            global.logger.write('Elevador apagado por posible atasco');
                            this.Ubicacion('5', (err: any) => {
                                global.logger.error('Enviando a ubicacion ' + this.Is_Location+err)
                            });

                        }else{
                            global.logger.error('no es posible detener elevador luego de atasco ');

                        }
                    });
                }

            }
        },time_wait);
        let intervalwait:any = setInterval(()=>{
            if(this.Principal.state_Machine == global.State_Machine.In_level||this.Principal.state_Machine == global.State_Machine.Init_location || this.Principal.state_Machine == global.State_Machine.No_task){
                if (intervalwait != null)
                {   intervalwait = null;
                    clearInterval(settimeout_wait);
                    clearInterval(intervalwait);
                }
            }
        },100)
    };



    private wait_for_up_select=()=>{

        switch (this.Is_pin ){
            case 'f':
            case 'F':
                this.wait_for_up(global.Time_wait_for_up_level_F);
                break;
            case 'E':
            case 'e':
                this.wait_for_up(global.Time_wait_for_up_level_E);
                break;
            case 'D':
            case 'd':
                this.wait_for_up(global.Time_wait_for_up_level_D);
                break;
            case 'c':
            case 'C':
                this.wait_for_up(global.Time_wait_for_up_level_C);
                break;
            case 'b':
            case 'B':
                this.wait_for_up(global.Time_wait_for_up_level_B);
                break;
            case 'a':
            case 'A':
                this.wait_for_up(global.Time_wait_for_up_level_A);
                break;
            default:
                this.wait_for_up(null);

        }

    };
    private wait_for_up_down=(data:any)=>{
        let time_wait= global.Time_wait_for_up_level;
        if(data!==null){
            time_wait= data;
        }
        let settimeout_wait=setTimeout(()=>{
            if (intervalwait != null)
            {   intervalwait = null;
                clearInterval(intervalwait);
                if(this.Principal.state_Machine == global.State_Machine.Go_to_level||this.Principal.state_Machine == global.State_Machine.Go_to_Init_location || this.Principal.state_Machine == global.State_Machine.Go_to_finish_location || this.Principal.state_Machine == global.State_Machine.Go_to_Init_location_ERROR){
                    global.logger.fatal('tiempo excedido');
                    this.Principal.Atasco();
                    global.number_atasco++;
                    this.Principal.state_Machine=global.State_Machine.atasco;
                    this.Principal.Is_init_location=false;
                    this.Out1.motoroff( (err:any) =>{
                        if (err==null){
                            if(global.number_atasco<2){
                                this.Out1.motorUP((err:any)=> {
                                    if (err==null){
                                        global.logger.write('Elevador hacia arriba '+err);
                                        setTimeout( ()=> {
                                            this.Ubicacion('5', (err: any) => {
                                                global.logger.error('Enviando a ubicacion ' + this.Is_Location+err)
                                            });
                                        }, 1500);
                                    }else{
                                        global.logger.error(global.result.ERROR_DISPENSING_LEVEL.text);

                                    }
                                });
                            }else{
                                this.Out1.motoroff( (err:any) =>{
                                    if (err==null){
                                        global.logger.error('elevador atascado ');
                                } else{
                                    global.logger.error('no es posible detener elevador luego de atasco ');

                                }
                            });

                            }

                            global.logger.write('Elevador apagado por posible atasco');


                        }else{
                            global.logger.error('no es posible detener elevador luego de atasco ');

                        }
                    });
                }

            }
        },time_wait);
        let intervalwait:any = setInterval(()=>{
            if(this.Principal.state_Machine == global.State_Machine.In_level||this.Principal.state_Machine == global.State_Machine.Init_location || this.Principal.state_Machine == global.State_Machine.No_task){
                if (intervalwait != null)
                {   intervalwait = null;
                    clearInterval(settimeout_wait);
                    clearInterval(intervalwait);
                }
            }
        },100)
    };
    private wait_for_up_select_down=()=>{

        switch (this.Is_pin ){
            case 'f':
            case 'F':
                this.wait_for_up_down(global.Time_wait_for_up_level_F);
                break;
            case 'E':
            case 'e':
                this.wait_for_up_down(global.Time_wait_for_up_level_E);
                break;
            case 'D':
            case 'd':
                this.wait_for_up_down(global.Time_wait_for_up_level_D);
                break;
            case 'c':
            case 'C':
                this.wait_for_up_down(global.Time_wait_for_up_level_C);
                break;
            case 'b':
            case 'B':
                this.wait_for_up_down(global.Time_wait_for_up_level_B);
                break;
            case 'a':
            case 'A':
                this.wait_for_up_down(global.Time_wait_for_up_level_A);
                break;
            default:
                this.wait_for_up_down(null);

        }

    };
    private empty=(data:any,cb:callback)=>{
        global.logger.debug('llega al interval');
        let cont:number=0;
        setTimeout(()=>{
            let intervalempty:any = setInterval(()=>{
                if(global.Is_empty == true){
                    if (intervalempty != null)
                    {   intervalempty = null;
                        clearInterval(intervalempty);
                        cb(null)
                    }
                }else if(cont>global.Time_wait_to_receive){
                    if (intervalempty != null)
                    {   intervalempty = null;
                        clearInterval(intervalempty);
                        cb(global.result.ERROR_RECEIVE_PRODUCT)
                    }
                }
                cont++;
            },100)

        },2000)


    };
    private Sale_column=(location_:string,cb:callback)=>{
        try{
           // this.wait_for_dispensing();
            let location=Array.from(location_);
            let locations=location.slice(1);
            let pin=location.slice(0,1);
            _async.mapSeries(locations,(Columna:any,cb1:callback)=>{
                let Loc=pin+Columna;
                this.Out1.HIGH(Loc.toString(),(err:any) =>{
                    global.logger.write('activa'+this.Is_Location);
                    cb1(err);
                });
            },(err:any)=>{
                cb(err);
                this.Principal.state_Machine = global.State_Machine.Dispensing_product;


            });
        }catch (e){
            global.result.EXCEPTION.stack=e.stack;
            global.logger.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }

    };
    private Sale_column_low=(location_:string,cb:callback)=>{
        let location=Array.from(location_);
        let locations=location.slice(1);
        let pin=location.slice(0,1);
        _async.mapSeries(locations,(Columna:any,cb1:callback)=>{
            let Loc=pin+Columna;
            this.Out1.LOW(Loc.toString(),(err:any) =>{
                global.logger.write('desactiva'+this.Is_Location);
                cb1(err);
            });
        },(err:any)=>{
            cb(err);
        });
    };
    private Sale_steps=(pin:string,location:string,cb:callback)=>{
       // this.init_location;
        this.Is_pin =pin;
        this.Is_Location =location;
        global.logger.write('sales steps'+ this.Is_pin);


        _async.series([
                _async.apply(this.Input.initial_elevator_call, null),
                _async.apply(this.Ubicacion, '1'),
                _async.apply(this.GotoLevel, this.Is_pin),
                _async.apply(this.Sale_U, location),
                _async.apply(this.init_product, null),
                _async.apply(this.empty, null)
            ],(err:any|null,result?:any)=> {
                if(err === null) {
                    global.logger.debug('proceso de venta completo');
                    cb(null,result)
                } else{
                    if (err.value== 6){
                        cb(null);
                        global.logger.error('Se dispenso pero no se recogio el producto ' + JSON.stringify(err));
                    }else{
                        global.logger.fatal('no se completo el proceso ' + JSON.stringify(err));
                        cb(err);
                    }

                }
            }
        );
    };
    private preparing_to_dispense=(cb:callback)=>{
        let time=global.Time_down_to_dispensing_small;
        if(global.Product_is==2){
            time=global.Time_down_to_dispensing_big;
        }else{
            time=global.Time_down_to_dispensing_small;
        }
        this.Out1.motorDown((err:any)=> {
            if (err==null){
                global.logger.write('Elevador hacia abajo '+err);
                setTimeout( ()=> {
                    this.Out1.motoroff( (err:any) =>{
                        if (err==null){
                            global.logger.write('Elevador apagado y en posición de venta'+err);
                            cb(null)
                        }else{
                            global.logger.error(global.result.ERROR_DISPENSING_LEVEL.text);
                            cb(global.result.ERROR_DISPENSING_LEVEL)
                        }
                    });
                }, time);
            }else{
                global.logger.error(global.result.ERROR_DISPENSING_LEVEL.text);
                cb(global.result.ERROR_DISPENSING_LEVEL)
            }
        });
    };
    ///Funcion que ubica elevador en la puerta inferior
    private preparing_to_receive=(cb:callback)=>{

        this.Out1.motorDown((err:any)=> {
            if (err==null){
                global.logger.write('Elevador hacia abajo '+err);
                setTimeout( ()=> {
                    this.Out1.motoroff( (err:any) =>{
                        if (err==null){
                            global.logger.write('Elevador apagado y en posición de recibir'+err);
                            cb(null)
                        }else{
                            global.logger.error('No fu posible detener el motor luego de preaparar para para recibir');
                            cb('No fu posible detener el motor luego de preaparar para recibir')
                        }
                    });
                }, 250);
            }else{
                global.logger.error('No fu posible detener el motor luego de preaparar para entregar');
            }
        });
    };
    private Go_level=(pin:string,cb:callback)=>{
        try {
            let intervalGoLevel: any = setInterval(() => {
                if (this.Principal.state_Machine == global.State_Machine.Init_location) {
                    if (intervalGoLevel != null) {
                        intervalGoLevel = null;
                        clearInterval(intervalGoLevel);
                        this.Out1.motorUP((err: any) => {
                            this.wait_for_up_select();
                            //this.wait_for_up_select_down();
                            this.Principal.state_Machine = global.State_Machine.Go_to_level;
                            global.logger.write('motor avanza arriba' + err);
                            cb(err);
                        });
                    }

                }else if(this.Principal.state_Machine==global.State_Machine.atasco){
                    if (intervalGoLevel != null)
                    {   intervalGoLevel= null;
                        clearInterval(intervalGoLevel);

                    }
                }
            }, 100)
        }catch (e){
            global.logger.error(e.stack);
        }
    };
    public GotoLevel=(data:string,cb:callback):void =>{
        try {
                let pin = Array.from(data);
                if (pin.length > 2) {
                    cb('dato incorrecto');
                } else {
                    switch (pin[0]) {
                        case 'a':
                        case 'A':
                            this.Go_level('A',(err:any)=>{
                                cb(err, 'Piso A');
                            });
                            break;
                        case 'b':
                        case 'B':
                            this.Go_level('B',(err:any)=>{
                                cb(err, 'Piso B');
                            });
                            break;
                        case 'c':
                        case 'C':
                            this.Go_level('C',(err:any)=>{
                                cb(err, 'Piso C');
                            });
                            break;

                        case 'd':
                        case 'D':
                            this.Go_level('D',(err:any)=>{
                                cb(err, 'Piso D');
                            });
                            break;

                        case 'e':
                        case 'E':
                            this.Go_level('E',(err:any)=>{
                                cb(err, 'Piso E');
                            });
                            break;
                        case 'f':
                        case 'F':
                            this.Go_level('F',(err:any)=>{
                                cb(err, 'Piso F');
                            });

                            break;
                        default:
                            cb('dato incorrecto');
                            break;
                    }
                }

        }catch(e) {
            global.logger.error(e.stack+'Error al venta');
            cb(e.stack);
        }
    };

    public Ubicacion=(data:any,cb:callback):void =>{
        try {

            this.wait_for_up_select_down();
            if(this.Principal.Is_init_location===false){
               switch(data){
                   case '2':
                       global.number_atasco=0;
                    this.Principal.state_Machine=global.State_Machine.Go_to_finish_location;
                    this.Out1.motorDown((err:any)=> {
                        global.logger.write('motor bajando afinalizar compra'+err);
                        cb(err);
                    });
                    break;
                   case '1':
                       global.number_atasco=0;
                    this.Principal.state_Machine=global.State_Machine.Go_to_Init_location;
                    this.Out1.motorDown((err:any)=> {
                        global.logger.write('motor bajando a pocision inicial'+err);
                        cb(err);
                    });
                    break;
                   case '3':
                       global.number_atasco=0;
                       this.Principal.state_Machine=global.State_Machine.Go_to_Init_location_ERROR;
                       this.Out1.motorDown((err:any)=> {
                           global.logger.error('motor bajando a pocision inicial al no encotrar productos en la banda'+err);
                           cb(err);
                       });
                       this.Is_sale_error=true;

                       break;
                   case '4':
                       global.number_atasco=0;
                       this.Principal.state_Machine=global.State_Machine.Go_to_Init_location_ERROR;
                       this.Out1.motorDown((err:any)=> {
                           global.logger.error('motor bajando a pocision inicial al ser detenido por el sensor 1'+err);
                           cb(err);
                       });
                       this.Is_sale_error=true;

                       break;
                   case '5':
                       this.Principal.state_Machine=global.State_Machine.Go_to_Init_location_ERROR;
                       this.Out1.motorDown((err:any)=> {
                           global.logger.error('motor bajando a pocision inicial por atasco'+err);
                           cb(err);
                       });
                       this.Is_sale_error=true;

                       break;
                }
            }else{
                cb(null);
                this.Principal.state_Machine = global.State_Machine.Init_location;
                global.logger.debug('ya esta en posicion inicial');
            }
        }catch(e) {
            global.logger.error(e.stack+'Error ubicar elevador');
            cb(e.stack);
        }
    };
    public init_location=(data:any,cb:callback):void =>{
        try {
            this.Input.initial_elevator();
        }catch(e) {
            global.result.EXCEPTION.stack=e.stack;
            global.logger.error(JSON.stringify(global.result.EXCEPTION));
            cb(global.result.EXCEPTION);
        }
    };

    public Close= (cb:callback):void=> {
        try {
            this.Input.Close((err:any)=>{
                cb(err);
            });
        }catch(e) {
            global.logger.error(e.stack+"Error detener lectura de sensores ");
            cb(e);
        }
    };
    public Open_= (cb:callback):void=> {
        try {
            this.Input.Open(()=>{
                cb(null)
            });

        }catch(e) {
            global.logger.error(e.stack+"Error al activar los sensores  ");
            cb(e)
        }
    };
    public ProcessEnv_PIN=(Pin:string):void =>{
        try {

            global.logger.debug('pin   '+Pin+ '  activo');
            switch (Pin) {

                case'P1':
                    if (this.Is_pin === 'F' ||this.Is_pin === 'f') {
                       if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                           this.PisoF_ON++;
                           if(this.PisoF_ON>global.Product_long){
                               global.logger.error('demasiadas vueltas para producto en fila F');
                               this.Sale_column_low(this.Is_Location, (err: any) => {
                                   global.logger.write('Apagaaa' + this.Is_Location+err)
                               });
                               this.Ubicacion('3', (err: any) => {
                                   global.logger.error('Enviando a ubicacion inicial ' + this.Is_Location+err)
                               });
                           }
                        }
                    }
                    break;
                case'P2':
                    if (this.Is_pin === 'E' ||this.Is_pin === 'e') {
                        if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                            this.PisoE_ON++;
                            if(this.PisoE_ON>global.Product_long){
                                global.logger.error('demasiadas vueltas para producto en fila E');
                                this.Sale_column_low(this.Is_Location, (err: any) => {
                                    global.logger.write('Apagaaa' + this.Is_Location +err)
                                });
                                this.Ubicacion('3', (err: any) => {
                                    global.logger.error('Enviando a ubicacion ' + this.Is_Location+ err)
                                });
                            }
                        }
                    }
                    break;
                case'P3':
                    if (this.Is_pin === 'D' ||this.Is_pin === 'd') {
                        if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                            this.PisoD_ON++;
                            if(this.PisoD_ON>global.Product_long){
                                global.logger.error('demasiadas vueltas para producto');
                                this.Sale_column_low(this.Is_Location, (err: any) => {
                                    global.logger.write('Apagaaa' + this.Is_Location+err)
                                });
                                this.Ubicacion('3', (err: any) => {
                                    global.logger.error('Enviando a ubicacion '+err )
                                });
                            }
                        }
                    }
                    break;
                case'P4':
                    if (this.Is_pin === 'C' ||this.Is_pin === 'c') {
                        if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                            this.PisoC_ON++;
                            if(this.PisoC_ON>global.Product_long){
                                global.logger.error('demasiadas vueltas para producto para fila C');
                                this.Sale_column_low(this.Is_Location, (err: any) => {
                                    global.logger.write('Apagaaa' + this.Is_Location+err)
                                });
                                this.Ubicacion('3', (err: any) => {
                                    global.logger.error('Enviando a ubicacion '+err )
                                });
                            }
                        }
                    }
                    break;
                case'P5':
                    if (this.Is_pin === 'B' ||this.Is_pin === 'b') {
                        if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                            this.PisoB_ON++;
                            if(this.PisoB_ON>global.Product_long){
                                global.logger.error('demasiadas vueltas para producto en fila B');
                                this.Sale_column_low(this.Is_Location, (err: any) => {
                                    global.logger.write('Apagaaa' + this.Is_Location+err)
                                });
                                this.Ubicacion('3', (err: any) => {
                                    global.logger.error('Enviando a ubicacion ' + this.Is_Location+err)
                                });
                            }
                        }
                    }
                    break;
                case'P6':
                    if (this.Is_pin === 'A' ||this.Is_pin === 'a') {
                        if (this.Principal.state_Machine == global.State_Machine.Dispensing_product) {
                            this.PisoA_ON++;
                            if(this.PisoA_ON>global.Product_long){
                                global.logger.error('demasiadas vueltas para producto en fila A');
                                this.Sale_column_low(this.Is_Location, (err: any) => {
                                    global.logger.write('Apagaaa' + this.Is_Location+err)
                                });
                                this.Ubicacion('3', (err: any) => {
                                    global.logger.error('Enviando a ubicacion ' + this.Is_Location+err)
                                });
                            }
                        }
                    }
                    break;
            }
            // }
        }catch(e) {
            global.logger.error(e.stack+'Error al procesar evento');

        }
    };




}