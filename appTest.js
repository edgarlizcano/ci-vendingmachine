var express = require("express");
var app = express();
var body_parser = require('body-parser');

const socketIo = require('socket.io')
const http = require('http').createServer(app)
const io = socketIo(http)

var control = require("./Filejs/ControllerMachine")
var controlMachine;
function setControl() {
    controlMachine = new control.ControllerMachine();
    controlMachine.on("Sensor",(data)=>{
        socket.emit("Sensor", data)
        console.log("Se leyo el sensor "+piso+state)
    })
    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on("openPorts",()=>{
            console.log("Open ports")
        })
        socket.on("closePorts",()=>{
            console.log("close ports")
        })
        socket.on("initSensors",()=>{
            console.log("inist sensors")
        })
        socket.on("closeSensors",()=>{
            console.log("close sensors")
        })
        socket.on("motorUp",()=>{
            controlMachine.motorStartUp()
            console.log("motor up")
        })
        socket.on("motorDown",()=>{
            controlMachine.motorStartDown()
            console.log("motor down")
        })
        socket.on("motorStop",()=>{
            controlMachine.motorStop()
            console.log("motor stop")
        })
        socket.on("startRow",(data)=>{
            console.log("start row"+data.row)
        })
        socket.on("stopRow",(data)=>{
            console.log("stop row " +data.row)
        })
        socket.on("startCol",(data)=>{
            console.log("start col "+data.col)
        })
        socket.on("stopCol",(data)=>{
            console.log("stop col "+data.col)
        })
        socket.on("startCell",(data)=>{
            controlMachine.testCeldas(data.row, data.col, null,(err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("Prueba lista")
                }
            })
            console.log("start cell "+data.row+" "+data.col)
        })
        socket.on("stopCell",(data)=>{
            console.log("stop cell "+data.row+" "+data.col)
        })
    });
}

//Para formatear hora en la vista
app.locals.moment = require("moment");

app.use(body_parser.urlencoded({extended:true}));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))

app.set("view engine", "jade");

app.get("/control", function(request, response){
    setControl();
    response.render("control");
});

app.get("/", function(request, response){
    response.render("index");
});

http.listen(3000, function(){
    console.log("Servidor en el puerto 3000!");
});