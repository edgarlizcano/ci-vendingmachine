"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stdin = process.openStdin();
var ControllerMachine_1 = require("./ControllerMachine");
var control = new ControllerMachine_1.ControllerMachine();
menu();
stdin.addListener("data", function (d) {
    menu();
    var cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            console.log("yendo a 1");
            control.GoTo(1);
            break;
        case "2":
            console.log("yendo a 2");
            control.GoTo(2);
            break;
        case "3":
            console.log("yendo a 3");
            control.GoTo(3);
            break;
        case "4":
            console.log("yendo a 4");
            control.GoTo(4);
            break;
        case "5":
            console.log("yendo a 5");
            control.GoTo(5);
            break;
        case "6":
            console.log("yendo a 6");
            control.GoTo(6);
            break;
        case "7":
            console.log("yendo a 7");
            control.GoTo(7);
            break;
        case "s":
            console.log("Stop");
            control.motorStop();
            break;
        default:
            console.log("opcion incorrecta");
    }
});
function menu() {
    console.log("0 - goto main");
    console.log("1 - goto 1");
    console.log("2 - goto 2");
    console.log("3 - goto 3");
    console.log("4 - goto 4");
    console.log("5 - goto 5");
    console.log("6 - goto 6");
    console.log("stop");
}
