let express = require("express");
let app = express();
let body_parser = require('body-parser');

const socketIo = require('socket.io');
const http = require('http').createServer(app);
const io = socketIo(http);

let control = require("./Filejs/ControllerMachine");
let controlMachine;
function setControl() {
    controlMachine = new control.ControllerMachine();
    controlMachine.on("Sensor",(data)=>{
        socket.emit("Sensor", data);
        console.log("Se leyo el sensor "+piso+" estado "+state)
    });
    io.once('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on("dispense",(data)=>{
            console.log("Test Dispensing");
            socket.emit('EventControl', {'cmd':'startTestDisp','row': data.row, 'col':data.col});
            controlMachine.dispenseItem(data.row, data.col,null,14,(err)=>{
                if(err==null){
                    console.log("Test dispensing successful");
                    socket.emit('EventControl', {'cmd':'readyTestDisp','row': data.row, 'col':data.col});
                }else{
                    console.log("Test dispensing failed");
                    socket.emit('EventControl', {'cmd':'errorTestDisp','row': data.row, 'col':data.col});
                }
            })
        });
        socket.on("motorUp",()=>{
            controlMachine.motorStartUp();
            console.log("motor up")
        });
        socket.on("motorDown",()=>{
            controlMachine.motorStartDown();
            console.log("motor down")
        });
        socket.on("motorStop",()=>{
            controlMachine.motorStop();
            console.log("motor stop")
        });
        socket.on("startRow",(data)=>{
            console.log("start row"+data.row)
        });
        socket.on("stopRow",(data)=>{
            console.log("stop row " +data.row)
        });
        socket.on("startCol",(data)=>{
            console.log("start col "+data.col)
        });
        socket.on("stopCol",(data)=>{
            console.log("stop col "+data.col)
        });
        socket.on("startCell",(data)=>{
            socket.emit('EventControl', {'cmd':'startTestCell','row': data.row, 'col':data.col});
            controlMachine.testCeldas(data.row, data.col, null,(err)=>{
                if(err){
                    console.log(err)
                    socket.emit('EventControl', {'cmd':'errorTestCell','row': data.row, 'col':data.col})
                }else{
                    console.log("Prueba lista");
                    socket.emit('EventControl', {'cmd':'readyTestCell','row': data.row, 'col':data.col})
                }
            });
            console.log("start cell "+data.row+" "+data.col)
        });
        socket.on("stopCell",(data)=>{
            console.log("stop cell "+data.row+" "+data.col)
        })
        socket.on("testPin",(data)=>{
            socket.emit("EventControl",{'cmd':"WriteHighPin"});
            controlMachine.testPinOut(data.mcp, data.pin, (err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("Prueba lista");
                    socket.emit("EventControl",{'cmd':"WriteLowPin"});
                }
            });
        });
    });
}

//Para formatear hora en la vista
app.locals.moment = require("moment");

app.use(body_parser.urlencoded({extended:true}));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))

app.set("view engine", "jade");

app.get("/control", function(request, response){
    setControl();
    controlMachine.on("Event",(data)=>{
        if(data.cmd==="Maquina_Lista"){
            response.render("control");
        }
    });
    response.render("control");
});

app.get("/closecontrol", function(request, response){
    delete controlMachine;
    controlMachine = null;
    response.render("index");
});

app.get("/", function(request, response){
    response.render("index");
});

http.listen(9000, function(){
    console.log("Servidor en el puerto 9000!");
});