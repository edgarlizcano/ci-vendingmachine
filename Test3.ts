
let stdin = process.openStdin();
import _log from '@ci24/ci-logmodule';
/*let folderLogs = "/free/CI24/Logs/Machine/";
let data = {
    "pathFolder": folderLogs,
    "maxLogSizeMB": 10,
    "backups": 5,
    "fileName": "oto245.log",
    "level": "INFO"
};

_log.init(data);*/
import {Main} from './main';
let Machine = new Main();

_log.debug("Ingrese la ubicacion que desea vender");
_log.write("Ingrese la ubicacion que desea vender");
stdin.addListener("data", (d) => {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    let cmd = d.toString().trim();
    //_log.debug("entro");
    Machine.on('Event',(data:any)=>{
        console.log(JSON.stringify(data));
    });
    console.log(`you entered: [${cmd}]`);
    switch (cmd){
        case 'a1':
        case 'A1':
            Machine.Sale('a1',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'c12':
        case 'C12':
            Machine.Sale('c12',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'b12':
        case 'B12':
            Machine.Sale('b12',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'b34':
        case 'B34':
            Machine.Sale('b34',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'b56':
        case 'B56':
            Machine.Sale('b56',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'c34':
        case 'C34':
            Machine.Sale('c34',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'c56':
        case 'C56':
            Machine.Sale('c56',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'c78':
        case 'C78':
            Machine.Sale('c78',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'c90':
        case 'C90':
            Machine.Sale('c90',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'd12':
        case 'D12':
            Machine.Sale('d12',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'd34':
        case 'D34':
            Machine.Sale('d34',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'd56':
        case 'D56':
            Machine.Sale('d56',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'd78':
        case 'D78':
            Machine.Sale('d78',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'd90':
        case 'D90':
            Machine.Sale('d90',(res:any|null,resp?:any)=> {
                console.log('d90 time pin');
            });
            break;
        case 'f34':
        case 'F34':
            Machine.Sale('f34',(res:any|null,resp?:any)=> {
                console.log('f34 time pin');
            });
            break;
        case 'f12':
        case 'F12':
            Machine.Sale('f12',(res:any|null,resp?:any)=> {
                console.log('f34 time pin');
            });
            break;
        case 'f56':
        case 'F56':
            Machine.Sale('f56',(res:any|null,resp?:any)=> {
                console.log('f56 time pin');
            });
            break;
        case 'f78':
        case 'F78':
            Machine.Sale('f78',(res:any|null,resp?:any)=> {
                console.log('f78 time pin');
            });
            break;
        case 'f90':
        case 'F90':
            Machine.Sale('f90',(res:any|null,resp?:any)=> {
                console.log('f90 time pin');
            });
            break;
        case 'e34':
        case 'E34':
            Machine.Sale('e34',(res:any|null,resp?:any)=> {
                console.log('e34 time pin');
            });
            break;
        case 'e12':
        case 'E12':
            Machine.Sale('e12',(res:any|null,resp?:any)=> {
                console.log('e34 time pin');
            });
            break;
        case 'e56':
        case 'E56':
            Machine.Sale('e56',(res:any|null,resp?:any)=> {
                console.log('e56 time pin');
            });
            break;
        case 'e78':
        case 'E78':
            Machine.Sale('e78',(res:any|null,resp?:any)=> {
                console.log('e78 time pin');
            });
            break;
        case 'e90':
        case 'E90':
            Machine.Sale('e90',(res:any|null,resp?:any)=> {
                console.log('e90 time pin');
            });
            break;
        case 'a56':
        case 'A56':
            Machine.Sale('c90',(res:any|null,resp?:any)=> {
                console.log('A1 time pin');
            });
            break;
        case 'b1':
        case 'B1':
            Machine.Sale_big('b1',(res:any|null,resp?:any)=> {
                console.log('b1 time pin');
            });
            break;
        case 'c1':
        case 'C1':
            Machine.Sale('c1',(res:any|null,resp?:any)=> {
                console.log('c1 time pin');
            });
            break;
        case 'd1':
        case 'D1':
            Machine.Sale('d1',(res:any|null,resp?:any)=> {
                console.log('d1 time pin');
            });
            break;
        case 'e1':
        case 'E1':
            Machine.Sale('e1',(res:any|null,resp?:any)=> {
                console.log('e1 time pin');
            });
            break;
        case 'F1':
        case 'f1':
            Machine.Sale('f1',(res:any|null,resp?:any)=> {
                console.log('f1 time pin');
            });
            break;
        case 'a2':
        case 'A2':
            Machine.Sale('a2',(res:any|null,resp?:any)=> {
                console.log('A2 time pin');
            });
            break;
        case 'b2':
        case 'B2':
            Machine.Sale('b2',(res:any|null,resp?:any)=> {
                console.log('b2 time pin');
            });
            break;
        case 'c2':
        case 'C2':
            Machine.Sale('c2',(res:any|null,resp?:any)=> {
                console.log('c2 time pin');
            });
            break;
        case 'd2':
        case 'D2':
            Machine.Sale('d2',(res:any|null,resp?:any)=> {
                console.log('d2 time pin');
            });
            break;
        case 'e2':
        case 'E2':
            Machine.Sale('e2',(res:any|null,resp?:any)=> {
                console.log('e2 time pin');
            });
            break;
        case 'f2':
        case 'F2':
            Machine.Sale('f2',(res:any|null,resp?:any)=> {
                console.log('f2 time pin');
            });
            break;
        case 'a3':
        case 'A3':
            Machine.Sale('a3',(res:any|null,resp?:any)=> {
                console.log('A3 time pin');
            });
            break;
        case 'b3':
        case 'B3':
            Machine.Sale('b3',(res:any|null,resp?:any)=> {
                console.log('b3 time pin');
            });
            break;
        case 'c3':
        case 'C3':
            Machine.Sale('c3',(res:any|null,resp?:any)=> {
                console.log('c3 time pin');
            });
            break;
        case 'd3':
        case 'D3':
            Machine.Sale('d3',(res:any|null,resp?:any)=> {
                console.log('d3 time pin');
            });
            break;
        case 'e3':
        case 'E3':
            Machine.Sale('e3',(res:any|null,resp?:any)=> {
                console.log('e3 time pin');
            });
            break;
        case 'f3':
        case 'F3':
            Machine.Sale('f3',(res:any|null,resp?:any)=> {
                console.log('e3 time pin');
            });
            break;
        case 'a4':
        case 'A4':
            Machine.Sale('a4',(res:any|null,resp?:any)=> {
                console.log('A4 time pin');
            });
            break;
        case 'b4':
        case 'B4':
            Machine.Sale('b4',(res:any|null,resp?:any)=> {
                console.log('b4 time pin');
            });
            break;
        case 'c4':
        case 'C4':
            Machine.Sale('c4',(res:any|null,resp?:any)=> {
                console.log('c4 time pin');
            });
            break;
        case 'd4':
        case 'D4':
            Machine.Sale('d4',(res:any|null,resp?:any)=> {
                console.log('d4 time pin');
            });
            break;
        case 'e4':
        case 'E4':
            Machine.Sale('e4',(res:any|null,resp?:any)=> {
                console.log('e4 time pin');
            });
            break;
        case 'f4':
        case 'F4':
            Machine.Sale('f4',(res:any|null,resp?:any)=> {
                console.log('f4 time pin');
            });
            break;
        case 'a5':
        case 'A5':
            Machine.Sale('a5',(res:any|null,resp?:any)=> {
                console.log('A5 time pin');
            });
            break;
        case 'b5':
        case 'B5':
            Machine.Sale('b5',(res:any|null,resp?:any)=> {
                console.log('b5 time pin');
            });
            break;
        case 'c5':
        case 'C5':
            Machine.Sale('c5',(res:any|null,resp?:any)=> {
                console.log('c5 time pin');
            });
            break;
        case 'd5':
        case 'D5':
            Machine.Sale('d5',(res:any|null,resp?:any)=> {
                console.log('d5 time pin');
            });
            break;
        case 'e5':
        case 'E5':
            Machine.Sale('e5',(res:any|null,resp?:any)=> {
                console.log('e5 time pin');
            });
            break;
        case 'F5':
        case 'f5':
            Machine.Sale('f5',(res:any|null,resp?:any)=> {
                console.log('f5 time pin');
            });
            break;
        case 'a6':
        case 'A6':
            Machine.Sale('a6',(res:any|null,resp?:any)=> {
                console.log('A6 time pin');
            });
            break;
        case 'b6':
        case 'B6':
            Machine.Sale('b6',(res:any|null,resp?:any)=> {
                console.log('b6 time pin');
            });
            break;
        case 'c6':
        case 'C6':
            Machine.Sale('c6',(res:any|null,resp?:any)=> {
                console.log('c6 time pin');
            });
            break;
        case 'd6':
        case 'D6':
            Machine.Sale('d6',(res:any|null,resp?:any)=> {
                console.log('d6 time pin');
            });
            break;
        case 'e6':
        case 'E6':
            Machine.Sale('e6',(res:any|null,resp?:any)=> {
                console.log('e6 time pin');
            });
            break;
        case 'f6':
        case 'F6':
            Machine.Sale('f6',(res:any|null,resp?:any)=> {
                console.log('f6 time pin');
            });
            break;
        case 'a7':
        case 'A7':
            Machine.Sale('a7',(res:any|null,resp?:any)=> {
                console.log('A7 time pin');
            });
            break;
        case 'b7':
        case 'B7':
            Machine.Sale('b7',(res:any|null,resp?:any)=> {
                console.log('b7 time pin');
            });
            break;
        case 'c7':
        case 'C7':
            Machine.Sale('c7',(res:any|null,resp?:any)=> {
                console.log('c7 time pin');
            });
            break;
        case 'd7':
        case 'D7':
            Machine.Sale('d7',(res:any|null,resp?:any)=> {
                console.log('d7 time pin');
            });
            break;
        case 'e7':
        case 'E7':
            Machine.Sale('e7',(res:any|null,resp?:any)=> {
                console.log('e7 time pin');
            });
            break;
        case 'F7':
        case 'f7':
            Machine.Sale('f7',(res:any|null,resp?:any)=> {
                console.log('f7 time pin');
            });
            break;
        case 'a8':
        case 'A8':
            Machine.Sale('a8',(res:any|null,resp?:any)=> {
                console.log('A8 time pin');
            });
            break;
        case 'b8':
        case 'B8':
            Machine.Sale('b8',(res:any|null,resp?:any)=> {
                console.log('b8 time pin');
            });
            break;
        case 'c8':
        case 'C8':
            Machine.Sale('c8',(res:any|null,resp?:any)=> {
                console.log('c8 time pin');
            });
            break;
        case 'd8':
        case 'D8':
            Machine.Sale('d8',(res:any|null,resp?:any)=> {
                console.log('d8 time pin');
            });
            break;
        case 'e8':
        case 'E8':
            Machine.Sale('e8',(res:any|null,resp?:any)=> {
                console.log('e8 time pin');
            });
            break;
        case 'f8':
        case 'F8':
            Machine.Sale('f8',(res:any|null,resp?:any)=> {
                console.log('f8 time pin');
            });
            break;
        case 'a9':
        case 'A9':
            Machine.Sale('a9',(res:any|null,resp?:any)=> {
                console.log('A9 time pin');
            });
            break;
        case 'b9':
        case 'B9':
            Machine.Sale('b9',(res:any|null,resp?:any)=> {
                console.log('b9 time pin');
            });
            break;
        case 'c9':
        case 'C9':
            Machine.Sale('c9',(res:any|null,resp?:any)=> {
                console.log('c9 time pin');
            });
            break;
        case 'd9':
        case 'D9':
            Machine.Sale('d9',(res:any|null,resp?:any)=> {
                console.log('d9 time pin');
            });
            break;
        case 'e9':
        case 'E9':
            Machine.Sale('e9',(res:any|null,resp?:any)=> {
                console.log('e9 time pin');
            });
            break;
        case 'F9':
        case 'f9':
            Machine.Sale('f9',(res:any|null,resp?:any)=> {
                console.log('f9 time pin');
            });
            break;
        case 'a0':
        case 'A0':
            Machine.Sale('a0',(res:any|null,resp?:any)=> {
                console.log('A0 time pin');
            });
            break;
        case 'b0':
        case 'B0':
            Machine.Sale('b0',(res:any|null,resp?:any)=> {
                console.log('b0 time pin');
            });
            break;
        case 'c0':
        case 'C0':
            Machine.Sale('c0',(res:any|null,resp?:any)=> {
                console.log('c0 time pin');
            });
            break;
        case 'd0':
        case 'D0':
            Machine.Sale('d0',(res:any|null,resp?:any)=> {
                console.log('d0 time pin');
            });
            break;
        case 'e0':
        case 'E0':
            Machine.Sale('e0',(res:any|null,resp?:any)=> {
                console.log('e0 time pin');
            });
            break;
        case 'f0':
        case 'F0':
            Machine.Sale('f0',(res:any|null,resp?:any)=> {
                console.log('f0 time pin');
            });
            break;
    }
});