"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sensor_1 = require("./Sensor");
var stdin = process.openStdin();
//let ControllerMachine = require("./Machine");
//let control = new ControllerMachine(null);
var sensor = new Sensor_1.Sensor();
sensor.Get_state(function () { });
/*
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
})*/
