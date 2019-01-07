import Maps from './ConfigMachine';
let stdin = process.openStdin();
import {ControllerMachine} from "./ControllerMachine";
let control = new ControllerMachine();

stdin.addListener("data", (d) => {
    let cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            control.pollSensor(Maps.Sensor[1].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 1 es "+value)
            })
            break;
        case "2":
            control.pollSensor(Maps.Sensor[2].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 2 es "+value)
            })
            break;
        case "3":
            control.pollSensor(Maps.Sensor[3].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 3 es "+value)
            })
            break;
        case "4":
            control.pollSensor(Maps.Sensor[4].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 4 es "+value)
            })
            break;
        case "5":
            control.pollSensor(Maps.Sensor[5].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 5 es "+value)
            })
            break;
        case "6":
            control.pollSensor(Maps.Sensor[6].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 6 es "+value)
            })
            break;
        case "7":
            control.pollSensor(Maps.Sensor[7].PIN,(err:any, value:any)=>{
                console.log("valor del pin piso 7 es "+value)
            })
            break;
    }
})