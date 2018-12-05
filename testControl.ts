let stdin = process.openStdin();
import {ControllerMachine} from "./ControllerMachine";
let control = new ControllerMachine();
stdin.addListener("data", (d) => {

    let cmd = d.toString().trim();
    switch (cmd) {
        case "0":
            control.GoTo(0);
            break;
        case "1":
            //control.motorStartUp();
            break;
        case "2":
            //control.motorStopUp();
            break;
        case "3":
            //control.motorStartDown();
            break;
        case "4":
            //control.motorStopDown();
            break;
        case "5":
            control.GoTo(5);
            break;
        case "6":
            control.GoTo(6);
            break;
        default:
            console.log("opcion incorrecta");
    }

})

function  menu() {
    console.log("0 - goto 0");
    console.log("1 - iniciar subida");
    console.log("2 - detener subida");
    console.log("3 - iniciar bajada");
    console.log("4 - detener bajada");
    console.log("5 - goto 5");
    console.log("6 - goto 6");
}