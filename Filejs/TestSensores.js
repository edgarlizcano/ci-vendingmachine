"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigMachine_1 = __importDefault(require("./ConfigMachine"));
var stdin = process.openStdin();
var ControllerMachine_1 = require("./ControllerMachine");
var control = new ControllerMachine_1.ControllerMachine();
stdin.addListener("data", function (d) {
    var cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            control.pollSensor(ConfigMachine_1.default.Sensor[1].PIN, function (err, value) {
                console.log("valor del pin piso 1 es " + value);
            });
            break;
        case "2":
            control.pollSensor(ConfigMachine_1.default.Sensor[2].PIN, function (err, value) {
                console.log("valor del pin piso 2 es " + value);
            });
            break;
        case "3":
            control.pollSensor(ConfigMachine_1.default.Sensor[3].PIN, function (err, value) {
                console.log("valor del pin piso 3 es " + value);
            });
            break;
        case "4":
            control.pollSensor(ConfigMachine_1.default.Sensor[4].PIN, function (err, value) {
                console.log("valor del pin piso 4 es " + value);
            });
            break;
        case "5":
            control.pollSensor(ConfigMachine_1.default.Sensor[5].PIN, function (err, value) {
                console.log("valor del pin piso 5 es " + value);
            });
            break;
        case "6":
            control.pollSensor(ConfigMachine_1.default.Sensor[6].PIN, function (err, value) {
                console.log("valor del pin piso 6 es " + value);
            });
            break;
        case "7":
            control.pollSensor(ConfigMachine_1.default.Sensor[7].PIN, function (err, value) {
                console.log("valor del pin piso 7 es " + value);
            });
            break;
    }
});