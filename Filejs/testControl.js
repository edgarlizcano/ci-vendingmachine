"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stdin = process.openStdin();
var ControllerMachine_1 = require("./ControllerMachine");
var control = new ControllerMachine_1.ControllerMachine();
var global = require("./Global");
menu();
stdin.addListener("data", function (d) {
    menu();
    var cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            control.motorCintaStart(11, 4, 3);
            break;
        case "2":
            control.motorCintaStop(11, 4, 3);
            break;
        case "3":
            control.findRow(4, 9, null, function (err, f, c, c2) {
                console.log("fila: " + f + "Coll: " + c + "Coll2: " + c2);
            });
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
        case "c4":
            console.log("dispensando c4");
            control.dispenseItem(3, 4, null, 14, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b3":
            console.log("dispensando b3");
            control.dispenseItem(4, 3, null, 14, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f2":
            console.log("dispensando f2");
            control.dispenseItem(6, 2, null, 14, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
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
    console.log("7 - abajo");
    console.log("stop");
    console.log("c2");
}
