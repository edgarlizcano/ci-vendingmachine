let stdin = process.openStdin();
menu();
var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour:'numeric',
    minute:'numeric',
    second:'numeric'
};
let date  = new Date();
let datetime = date.toLocaleDateString("es-CO",options)

console.log(datetime); // 9/17/2016

stdin.addListener("data", (d) => {
    menu();
    let cmd = d.toString().trim();
    switch (cmd) {
        case "1":
            console.log("Tiempo de 6000 2 pisos atasco")
            controlTime(6000,7,5,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        case "2":
            console.log("Tiempo de 4000 2 pisos llegsa bien")
            controlTime(4000,7,5,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        case "3":
            console.log("Tiempo de 10000 6 pisos llega bien")
            controlTime(10000,7,1,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        case "4":
            console.log("Tiempo de 13000 6 pisos atasco")
            controlTime(13000,7,1,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        case "5":
            console.log("Tiempo de 10000 6 pisos llega bien")
            controlTime(10000,1,7,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        case "6":
            console.log("Tiempo de 13000 6 pisos atasco")
            controlTime(13000,1,7,(err:any)=>{
                if(err){
                    console.log("Posible atasco "+err)
                }else{
                    console.log("todo fine ")
                    menu();
                }
            })
            break;
        default:
            console.log("opcion incorrecta");
            menu();
    }
})

function  menu() {
    console.log("1 - 6000 atasco");
    console.log("2 - 4000 llega");
    console.log("3 - 10000 llega");
    console.log("4 - 13000 atasco");
    console.log("5 - 10000 llega");
    console.log("6 - 13000 atasco");
}

function controlTime(dato:number, location:number,goingto:number, callback:any){
    let nPisos = location - goingto;
    let time = 0;
    let countTime = 0;
    if(nPisos<0){
        nPisos = nPisos * -1;
    }
    time = nPisos * 2000;
    console.log("Se movera "+nPisos+ " en un tiempo límite para llegar a destino es "+time)
    //Espera la posición de destino
    let wait:any = setInterval(()=>{
        console.log(countTime)
        countTime=countTime+100;
        if(countTime==dato){
            console.log("Llego en: "+countTime)
            clearInterval(wait)
            callback(null)
        }
        if(countTime>time){
            console.log("Leyendo posible atasco, countTime: "+countTime);
            controlAtasco(2,callback);
            //callback("atasco")
            clearInterval(wait)
            wait=null;
        }
    },100)

}
let atasco = false
let intentos = 0
function controlAtasco(state:number, callback:any){
    atasco = true
    intentos ++
    if(intentos>2){
        callback("Elevador atascado luego de 3 intentos")
    }else{
        console.log("intento de desatasco número :"+intentos)
    }
    let motorState: number=state;
    if(motorState==1){
        console.log("Bajando 1 seg");
        setTimeout(()=>{
            console.log("detenido");
            callback(null)
        },1500)
    }else{
        console.log("Subiendo 1 seg");
        setTimeout(()=>{
            console.log("detenido")
            callback(null)
        },1500)
    }
}

//Control preciso

// function controlTime2(dato:number, location:number,goingto:number, callback:any){
//     let next:number;
//
//
//
//     let tiempo:any = setTimeout(()=>{
//         console.log("Llego en: "+countTime)
//         clearInterval(wait)
//         callback(null)
//     },dato)
//
//     //Espera la posición de destino
//     let wait:any = setInterval(()=>{
//         if(location>goingto){
//             next = location - 1;
//         }else{
//             next = location + 1;
//         }
//     },100)
// }



//Prueba control de tiempo de retiro de producto
/*
let hay = true
setTimeout(()=>{
    hay = true
},5000)
_async.series([
    (callback:any)=>{
        setTimeout(()=>{
            if(hay == false){
                console.log("Hay un producto")
                let wait:any = setInterval(()=>{
                    console.log("intervalo")
                    if (hay){
                        callback(null)
                        clearInterval(wait)
                        wait=null;
                    }
                },500)
            }else{
                console.log("No Hay producto")
                setTimeout(()=>{
                    console.log("espero 22 seg")
                    callback(null)
                },22000)
            }
        },1000)
    },
    (callback:any)=>{
        console.log("Tiempo espera termino");
        setTimeout(()=>{
            console.log("Pasaron 8 mas y Cerró");
            callback(null)
        },8000)
    }
],(result?:any)=> {
    if(result == null) {
        console.log('Proceso de venta completo '+result);
    } else{
        console.log("Error");
    }
})*/
