
let stdin = process.openStdin();
import {ControllerMachine} from "./ControllerMachine";
let control = new ControllerMachine();
let global = require("./Global2");
menu();
stdin.addListener("data", (d) => {
    menu();
    let cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            console.log("yendo a 1")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},1);
            break;
        case "2":
            console.log("yendo a 2")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},2);
            break;
        case "3":
            console.log("yendo a 3")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},3);
            break;
        case "4":
            console.log("yendo a 4")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},4);
            break;
        case "5":
            console.log("yendo a 5")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},5);
            break;
        case "6":
            console.log("yendo a 6")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},6);
            break;
        case "7":
            console.log("yendo a 7")
            control.GoTo((data:any)=>{console.log("llego :"+ data)},7);
            break;

        case "f1":
            console.log("dispensando f1")
            control.dispenseItem(6,1, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f3":
            console.log("dispensando f3")
            control.dispenseItem(6,3, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f4":
            console.log("dispensando f4")
            control.dispenseItem(6,4, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f9":
            console.log("dispensando f9")
            control.dispenseItem(6,9, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f2":
            console.log("dispensando f2")
            control.dispenseItem(6,2,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "f5":
            console.log("dispensando f5")
            control.dispenseItem(6,5, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f6":
            console.log("dispensando f6")
            control.dispenseItem(6,6, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f7":
            console.log("dispensando f7")
            control.dispenseItem(6,7, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f0":
            console.log("dispensando f0")
            control.dispenseItem(6,0,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "f8":
            console.log("dispensando f8")
            control.dispenseItem(6,8,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;

        case "b3":
            console.log("dispensando b3")
            control.dispenseItem(2,3,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b9":
            console.log("dispensando b9")
            control.dispenseItem(2,9,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "b7":
            console.log("dispensando b7")
            control.dispenseItem(2,7,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b1":
            console.log("dispensando b1")
            control.dispenseItem(2,1,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b2":
            console.log("dispensando b2")
            control.dispenseItem(2,2,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "b0":
            console.log("dispensando b0")
            control.dispenseItem(2,0,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b4":
            console.log("dispensando b4")
            control.dispenseItem(2,4,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b5":
            console.log("dispensando b5")
            control.dispenseItem(2,5,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;
        case "b6":
            console.log("dispensando b6")
            control.dispenseItem(2,6,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "b8":
            console.log("dispensando b8")
            control.dispenseItem(2,8,null,14,(err)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            })
            break;

        case "d5":
            console.log("dispensando d5")
            control.dispenseItem(4,5, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d1":
            console.log("dispensando d1")
            control.dispenseItem(4,1, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d2":
            console.log("dispensando d2")
            control.dispenseItem(4,2, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d9":
            console.log("dispensando d9")
            control.dispenseItem(4,9, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d3":
            console.log("dispensando d3")
            control.dispenseItem(4,3, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d4":
            console.log("dispensando d4")
            control.dispenseItem(4,4, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d0":
            console.log("dispensando d0")
            control.dispenseItem(4,0, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d6":
            console.log("dispensando d6")
            control.dispenseItem(4,6, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d7":
            console.log("dispensando d7")
            control.dispenseItem(4,7, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d8":
            console.log("dispensando d8")
            control.dispenseItem(4,8, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;

        case "c4":
            console.log("dispensando c4")
            control.dispenseItem(3,4, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c5":
            console.log("dispensando c5")
            control.dispenseItem(3,5,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "c1":
            console.log("dispensando c1")
            control.dispenseItem(3,1, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c8":
            console.log("dispensando c8")
            control.dispenseItem(3,8,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "c0":
            console.log("dispensando c0")
            control.dispenseItem(3,0,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "c2":
            console.log("dispensando c2")
            control.dispenseItem(3,2, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c3":
            console.log("dispensando c3")
            control.dispenseItem(3,3,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "c6":
            console.log("dispensando c6")
            control.dispenseItem(3,6, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c7":
            console.log("dispensando c7")
            control.dispenseItem(3,7,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "c9":
            console.log("dispensando c9")
            control.dispenseItem(3,9,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;

        case "e4":
            console.log("dispensando e4")
            control.dispenseItem(5,4, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e5":
            console.log("dispensando e5")
            control.dispenseItem(5,5,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "e1":
            console.log("dispensando e1")
            control.dispenseItem(5,1, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e8":
            console.log("dispensando e8")
            control.dispenseItem(5,8,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "e0":
            console.log("dispensando c0")
            control.dispenseItem(5,0,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "e2":
            console.log("dispensando c2")
            control.dispenseItem(5,2, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e3":
            console.log("dispensando e3")
            control.dispenseItem(5,3,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "e6":
            console.log("dispensando e6")
            control.dispenseItem(5,6, null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e7":
            console.log("dispensando e7")
            control.dispenseItem(5,7,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;
        case "e9":
            console.log("dispensando e9")
            control.dispenseItem(5,9,null,14,(err)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }})
            break;




        case "s":
            console.log("Stop")
            control.motorStop();
            break;
        default:
            console.log("opcion incorrecta");
    }

})

function  menu() {
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