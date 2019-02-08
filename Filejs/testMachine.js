
var stdin = process.openStdin();
var controller = require("./Machine");
var control = new controller(null);
menu();
stdin.addListener("data", function (d) {
    menu();
    var cmd = d.toString().trim();
    console.log("Celda: "+cmd);
    var piso = cmd.slice(0,1);
    var row = null;
    var c1 = cmd.slice(1,2);
    var c2 = null;
    if(cmd.length === 3){
        c2 = cmd.slice(2,3);
    }

    switch (piso) {
        case "h":
        case "H":
            control.enableMachine(null,()=>{});
            break;
        case "a":
        case "A":
            row = 1;
            break;
        case "b":
        case "B":
            row = 2;
            break;
        case "c":
        case "C":
            row = 3;
            break;
        case "d":
        case "D":
            row = 4;
            break;
        case "e":
        case "E":
            row = 5;
            break;
        case "f":
        case "F":
            row = 6;
            break;
        default:
            control.motorStop(null,()=>{})
    }
    if(row!=null){
        console.log("Dispensando en Fila: "+row+" Columna1: "+c1+" Columna2: "+c2);
        control.dispenseItem({ piso: row, c1: c1, c2: c2, height:14 }, function (err) {
            if (err == null) {
                console.log("Proceso completado");
            }
            else {
                console.log("Error al finalizar");
            }
        });
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
    console.log("7 - goto 7");
    console.log("stop");
}
