
var stdin = process.openStdin();
var controller = require("./Machine");
var control = new controller(null);
menu();
stdin.addListener("data", function (d) {
    menu();
    var cmd = d.toString().trim();
    console.log("Celda: "+cmd);
    var piso = cmd.slice(0,1);
    var row;
    var c1 = cmd.slice(1,2);
    var c2 = null;
    if(cmd.length === 3){
        c2 = cmd.slice(2,3);
    }

    switch (piso) {
        case "h":
        case "H":
            control.enableMachine(null,()=>{})
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
    }
    console.log("Dispensando en Fila: "+row+" Columna1: "+c1+" Columna2: "+c2);
    control.dispenseItem({ piso: row, c1: c1, c2: c2, height:14 }, function (err) {
        if (err == null) {
            console.log("Proceso completado con callback");
        }
        else {
            console.log("Error al finalizar");
        }
    });

    /*switch (cmd) {
        case "1":
            console.log("yendo a 1");
            control.GoTo(function (data) { console.log("llego :" + data); }, 1);
            break;
        case "2":
            console.log("yendo a 2");
            control.GoTo(function (data) { console.log("llego :" + data); }, 2);
            break;
        case "3":
            console.log("yendo a 3");
            control.GoTo(function (data) { console.log("llego :" + data); }, 3);
            break;
        case "4":
            console.log("yendo a 4");
            control.GoTo(function (data) { console.log("llego :" + data); }, 4);
            break;
        case "5":
            console.log("yendo a 5");
            control.GoTo(function (data) { console.log("llego :" + data); }, 5);
            break;
        case "6":
            console.log("yendo a 6");
            control.GoTo(function (data) { console.log("llego :" + data); }, 6);
            break;
        case "7":
            console.log("yendo a 7");
            control.GoTo(function (data) { console.log("llego :" + data); }, 7);
            break;

        case "a1":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 1, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a3":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 1, c1: 3, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a4":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 1, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a9":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 1, c1: 9, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a2":
            console.log("dispensando f2");
            control.dispenseItem({ piso: 1, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a5":
            console.log("dispensando f5");
            control.dispenseItem({ piso: 1, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a6":
            console.log("dispensando f6");
            control.dispenseItem({ piso: 1, c1: 6, c2: null, height:14}, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a7":
            console.log("dispensando f7");
            control.dispenseItem({ piso: 1, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a0":
            console.log("dispensando f0");
            control.dispenseItem({ piso: 1, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a8":
            console.log("dispensando f8");
            control.dispenseItem({ piso: 1, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 1, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 1, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 1, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 1, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "a90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 1, c1: 9, c2: 0, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;

        case "f1":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 6, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f3":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 6, c1: 3, c2: null, height:14}, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f4":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 6, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f9":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 6, c1: 9, c2: null, height:14 }, function (err) {
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
            control.dispenseItem({ piso: 6, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f5":
            console.log("dispensando f5");
            control.dispenseItem({ piso: 6, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f6":
            console.log("dispensando f6");
            control.dispenseItem({ piso: 6, c1: 6, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f7":
            console.log("dispensando f7");
            control.dispenseItem({ piso: 6, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f0":
            console.log("dispensando f0");
            control.dispenseItem({ piso: 6, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f8":
            console.log("dispensando f8");
            control.dispenseItem({ piso: 6, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 6, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 6, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 6, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 6, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "f90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 6, c1: 9, c2: 0, height:14 }, function (err) {
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
            control.dispenseItem({ piso: 2, c1: 3, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b9":
            console.log("dispensando b9");
            control.dispenseItem({ piso: 2, c1: 9, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b7":
            console.log("dispensando b7");
            control.dispenseItem({ piso: 2, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b1":
            console.log("dispensando b1");
            control.dispenseItem({ piso: 2, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b2":
            console.log("dispensando b2");
            control.dispenseItem({ piso: 2, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b0":
            console.log("dispensando b0");
            control.dispenseItem({ piso: 2, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b4":
            console.log("dispensando b4");
            control.dispenseItem({ piso: 2, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b5":
            console.log("dispensando b5");
            control.dispenseItem({ piso: 2, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b6":
            console.log("dispensando b6");
            control.dispenseItem({ piso: 2, c1: 6, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b8":
            console.log("dispensando b8");
            control.dispenseItem({ piso: 2, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 2, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 2, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 2, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 2, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "b90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 2, c1: 9, c2: 0, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;

        case "d5":
            console.log("dispensando d5");
            control.dispenseItem({ piso: 4, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d1":
            console.log("dispensando d1");
            control.dispenseItem({ piso: 4, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d2":
            console.log("dispensando d2");
            control.dispenseItem({ piso: 4, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d9":
            console.log("dispensando d9");
            control.dispenseItem({ piso: 4, c1: 9, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d3":
            console.log("dispensando d3");
            control.dispenseItem({ piso: 4, c1: 3, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d4":
            console.log("dispensando d4");
            control.dispenseItem({ piso: 4, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d0":
            console.log("dispensando d0");
            control.dispenseItem({ piso: 4, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d6":
            console.log("dispensando d6");
            control.dispenseItem({ piso: 4, c1: 6, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d7":
            console.log("dispensando d7");
            control.dispenseItem({ piso: 4, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d8":
            console.log("dispensando d8");
            control.dispenseItem({ piso: 4, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 4, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 4, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 4, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 4, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "d90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 4, c1: 9, c2: 0, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;

        case "c4":
            console.log("dispensando c4");
            control.dispenseItem({ piso: 3, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c5":
            console.log("dispensando c5");
            control.dispenseItem({ piso: 3, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c1":
            console.log("dispensando c1");
            control.dispenseItem({ piso: 3, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c8":
            console.log("dispensando c8");
            control.dispenseItem({ piso: 3, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c0":
            console.log("dispensando c0");
            control.dispenseItem({ piso: 3, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c2":
            console.log("dispensando c2");
            control.dispenseItem({ piso: 3, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c3":
            console.log("dispensando c3");
            control.dispenseItem({ piso: 3, c1: 3, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c6":
            console.log("dispensando c6");
            control.dispenseItem({ piso: 3, c1: 6, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c7":
            console.log("dispensando c7");
            control.dispenseItem({ piso: 3, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c9":
            console.log("dispensando c9");
            control.dispenseItem({ piso: 3, c1: 9, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 3, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 3, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 3, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 3, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "c90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 3, c1: 9, c2: 0, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;

        case "e4":
            console.log("dispensando e4");
            control.dispenseItem({ piso: 5, c1: 4, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e5":
            console.log("dispensando e5");
            control.dispenseItem({ piso: 5, c1: 5, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e1":
            console.log("dispensando e1");
            control.dispenseItem({ piso: 5, c1: 1, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e8":
            console.log("dispensando e8");
            control.dispenseItem({ piso: 5, c1: 8, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e0":
            console.log("dispensando c0");
            control.dispenseItem({ piso: 5, c1: 0, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e2":
            console.log("dispensando c2");
            control.dispenseItem({ piso: 5, c1: 2, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e3":
            console.log("dispensando e3");
            control.dispenseItem({ piso: 5, c1: 3, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e6":
            console.log("dispensando e6");
            control.dispenseItem({ piso: 5, c1: 6, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e7":
            console.log("dispensando e7");
            control.dispenseItem({ piso: 5, c1: 7, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e9":
            console.log("dispensando e9");
            control.dispenseItem({ piso: 5, c1: 9, c2: null, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e12":
            console.log("dispensando f1");
            control.dispenseItem({ piso: 5, c1: 1, c2: 2, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e34":
            console.log("dispensando f3");
            control.dispenseItem({ piso: 5, c1: 3, c2: 4, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e56":
            console.log("dispensando f4");
            control.dispenseItem({ piso: 5, c1: 5, c2: 6, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e78":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 5, c1: 7, c2: 8, height:14 }, function (err) {
                if (err == null) {
                    console.log("Proceso completado con callback");
                }
                else {
                    console.log("Error al finalizar");
                }
            });
            break;
        case "e90":
            console.log("dispensando f9");
            control.dispenseItem({ piso: 5, c1: 9, c2: 0, height:14 }, function (err) {
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
    }*/
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
