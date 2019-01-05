
let stdin = process.openStdin();
import {ControllerMachine} from "./ControllerMachine";
let control = new ControllerMachine();
menu();
stdin.addListener("data", (d) => {
    menu();
    let cmd = d.toString().trim();
    switch (cmd) {
        //Fila A
        case "a12":
            console.log("dispensando "+cmd);
            control.testCeldas(1,1, 2,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a1":
            console.log("dispensando "+cmd);
            control.testCeldas(1,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a2":
            console.log("dispensando "+cmd);
            control.testCeldas(1,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a3":
            console.log("dispensando "+cmd);
            control.testCeldas(1,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a4":
            console.log("dispensando "+cmd);
            control.testCeldas(1,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a5":
            console.log("dispensando "+cmd);
            control.testCeldas(1,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a6":
            console.log("dispensando "+cmd);
            control.testCeldas(1,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "a7":
            console.log("dispensando "+cmd);
            control.testCeldas(1,7,null,(err:any)=>{
            if(err == null){
                console.log("Proceso completado con callback")
            }else{
                console.log("Error al finalizar")
            }});
            break;
        case "a8":
            console.log("dispensando "+cmd);
            control.testCeldas(1,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "a9":
            console.log("dispensando "+cmd);
            control.testCeldas(1,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "a0":
            console.log("dispensando "+cmd);
            control.testCeldas(1,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        //Fila B
        case "b1":
            console.log("dispensando "+cmd);
            control.testCeldas(2,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b2":
            console.log("dispensando "+cmd);
            control.testCeldas(2,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b3":
            console.log("dispensando "+cmd);
            control.testCeldas(2,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b4":
            console.log("dispensando "+cmd);
            control.testCeldas(2,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b5":
            console.log("dispensando "+cmd);
            control.testCeldas(2,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b6":
            console.log("dispensando "+cmd);
            control.testCeldas(2,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "b7":
            console.log("dispensando "+cmd);
            control.testCeldas(2,7,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "b8":
            console.log("dispensando "+cmd);
            control.testCeldas(2,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "b9":
            console.log("dispensando "+cmd);
            control.testCeldas(2,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "b0":
            console.log("dispensando "+cmd);
            control.testCeldas(2,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        //Fila C
        case "c1":
            console.log("dispensando "+cmd);
            control.testCeldas(3,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c2":
            console.log("dispensando "+cmd);
            control.testCeldas(3,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c3":
            console.log("dispensando "+cmd);
            control.testCeldas(3,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c4":
            console.log("dispensando "+cmd);
            control.testCeldas(3,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c5":
            console.log("dispensando "+cmd);
            control.testCeldas(3,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c6":
            console.log("dispensando "+cmd);
            control.testCeldas(3,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "c7":
            console.log("dispensando "+cmd);
            control.testCeldas(3,7,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "c8":
            console.log("dispensando "+cmd);
            control.testCeldas(3,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "c9":
            console.log("dispensando "+cmd);
            control.testCeldas(3,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "c0":
            console.log("dispensando "+cmd);
            control.testCeldas(3,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        //Fila D
        case "d1":
            console.log("dispensando "+cmd);
            control.testCeldas(4,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d2":
            console.log("dispensando "+cmd);
            control.testCeldas(4,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d3":
            console.log("dispensando "+cmd);
            control.testCeldas(4,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d4":
            console.log("dispensando "+cmd);
            control.testCeldas(4,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d5":
            console.log("dispensando "+cmd);
            control.testCeldas(4,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d6":
            console.log("dispensando "+cmd);
            control.testCeldas(4,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "d7":
            console.log("dispensando "+cmd);
            control.testCeldas(4,7,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "d8":
            console.log("dispensando "+cmd);
            control.testCeldas(4,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "d9":
            console.log("dispensando "+cmd);
            control.testCeldas(4,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "d0":
            console.log("dispensando "+cmd);
            control.testCeldas(4,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        //Fila E
        case "e1":
            console.log("dispensando "+cmd);
            control.testCeldas(5,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e2":
            console.log("dispensando "+cmd);
            control.testCeldas(5,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e3":
            console.log("dispensando "+cmd);
            control.testCeldas(5,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e4":
            console.log("dispensando "+cmd);
            control.testCeldas(5,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e5":
            console.log("dispensando "+cmd);
            control.testCeldas(5,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e6":
            console.log("dispensando "+cmd);
            control.testCeldas(5,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "e7":
            console.log("dispensando "+cmd);
            control.testCeldas(5,7,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "e8":
            console.log("dispensando "+cmd);
            control.testCeldas(5,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "e9":
            console.log("dispensando "+cmd);
            control.testCeldas(5,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "e0":
            console.log("dispensando "+cmd);
            control.testCeldas(5,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        //Fila F
        case "f1":
            console.log("dispensando "+cmd);
            control.testCeldas(6,1, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f2":
            console.log("dispensando "+cmd);
            control.testCeldas(6,2, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f3":
            console.log("dispensando "+cmd);
            control.testCeldas(6,3,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f4":
            console.log("dispensando "+cmd);
            control.testCeldas(6,4, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f5":
            console.log("dispensando "+cmd);
            control.testCeldas(6,5, null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f6":
            console.log("dispensando "+cmd);
            control.testCeldas(6,6,null,(err:any)=> {
                if (err == null) {
                    console.log("Proceso completado con callback")
                } else {
                    console.log("Error al finalizar")
                }
            });
            break;
        case "f7":
            console.log("dispensando "+cmd);
            control.testCeldas(6,7,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "f8":
            console.log("dispensando "+cmd);
            control.testCeldas(6,8,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "f9":
            console.log("dispensando "+cmd);
            control.testCeldas(6,9,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "f0":
            console.log("dispensando "+cmd);
            control.testCeldas(6,0,null,(err:any)=>{
                if(err == null){
                    console.log("Proceso completado con callback")
                }else{
                    console.log("Error al finalizar")
                }});
            break;
        case "s":
            console.log("Stop");
            control.stopAll(()=>{});
            break;
        default:
            console.log("opcion incorrecta");
    }
});

function  menu() {
    console.log("Seleccione fila y columna");
    console.log("s stop");
}