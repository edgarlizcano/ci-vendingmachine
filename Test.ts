import {Main} from './main';
let Machine=new Main ();
import _log = require("@ci24/ci-logmodule");
import global from "./Global";
//Venta



let intervalproductend:any = setInterval(()=>{

        if (intervalproductend != null)
        {  // intervalproductend = null;
            //clearInterval(intervalproductend);
            setTimeout(()=>{
                Machine.Up_elevator((err:any,dta?:any)=>{
                    _log.write('arriba'+err);
                    setTimeout(()=>{
                        Machine.off_elevator((err:any,dta?:any)=>{
                            _log.write('err'+err);
                            setTimeout(()=>{
                                Machine.Down_elevator((err:any,dta?:any)=>{
                                    _log.write('err'+err);
                                    setTimeout(()=>{
                                        Machine.off_elevator((err:any,dta?:any)=>{
                                            _log.write('err'+err);
                                        })}, 2700)
                                })}, 1000)
                        })}, 3200);
                })}, 1000);

        }

},8000);




/*setTimeout(()=>{
    Machine.Testmotores((err:any,dta?:any)=>{
        _log.write('err'+err);
    })}, 5000);*/
/*

setTimeout(()=>{
  Machine.Sale('c1',(err:any,dta?:any)=>{
  _log.write('err'+err);
      setTimeout(()=>{
          Machine.Sale('d9',(err:any,dta?:any)=>{
              _log.write('err'+err);
              setTimeout(()=>{
                  Machine.Sale('d6',(err:any,dta?:any)=>{
                      _log.write('err'+err);
                      setTimeout(()=>{
                          Machine.Sale('c7',(err:any,dta?:any)=>{
                              _log.write('err'+err);
                              setTimeout(()=>{
                                  Machine.Sale('e6',(err:any,dta?:any)=>{
                                      _log.write('err'+err);
                                  })}, 30000);
                          })}, 30000);
                  })}, 30000);

          })}, 30000);

})}, 5000);*/
/*
setTimeout(()=>{
  Machine.Sale('a8',(err:any,dta?:any)=>{
  _log.write('err'+err);

})}, 5000);*/
/*
//Prueba Motores todos los pisos
setTimeout(()=>{
  Machine.Testmotores((err:any,dta?:any)=>{
  _log.write('err'+err);
})}, 5000);


//Prueba Motores solo un piso
setTimeout(()=>{
    Machine.TestmotoresPiso('A',(err:any,dta?:any)=>{
        _log.write('err'+err);
    })}, 5000);


//Prueba Motores unidad
setTimeout(()=>{
    Machine.Time_pin('A1',(err:any,dta?:any)=>{
        _log.write('err'+err);
    })}, 5000);
*/
let data={
    port:'/dev/ttyAMA0',
    baudRate:9600
};

/*setTimeout(()=>{
    Machine.CheckReader(data,(err:any,dta?:any)=>{
        _log.write('err'+err);
       setTimeout(()=>{
            Machine.GetIdCard((err:any,dta?:any)=>{
                _log.write('err'+err);
            })}, 5000);
    })}, 3000);*/
/*setTimeout(()=>{
    Machine.Check_Sensor(data,(err:any,dta?:any)=>{
        _log.write('err'+err);
       setTimeout(()=>{
            Machine.Get_state((err:any,dta?:any)=>{
                _log.write('err'+err);
                setTimeout(()=>{
                    Machine.Get_state((err:any,dta?:any)=>{
                        _log.write('err'+err);
                    })}, 5000);
            })}, 5000);
    })}, 3000);*/
/*setTimeout(()=>{
    Machine.Check_Sensor(data,(err:any,dta?:any)=>{
        _log.write('err'+err);
        let intervalGoLevel: any = setInterval(() => {
            Machine.Get_state((err:any,dta?:any)=>{
                _log.write('err'+err);})
        }, 2000);
    })}, 2000);*/

