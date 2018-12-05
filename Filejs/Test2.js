"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stdin = process.openStdin();
var ci_logmodule_1 = __importDefault(require("@ci24/ci-logmodule"));
var main_1 = require("./main");
var Machine = new main_1.Main();
ci_logmodule_1.default.debug("Ingrese la ubicacion que desea mover");
stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    var cmd = d.toString().trim();
    //_log.debug("entro");
    console.log("you entered: [" + cmd + "]");
    switch (cmd) {
        case 'a1':
        case 'A1':
            Machine.Time_pin('a1', function (res, resp) {
                console.log('A1 time pin');
            });
            break;
        case 'c34':
        case 'C34':
            Machine.Sale('C34', function (err, dta) {
                console.log('vende 34 c');
            });
            break;
        case 'b1':
        case 'B1':
            Machine.Time_pin('b1', function (res, resp) {
                console.log('b1 time pin');
            });
            break;
        case 'c1':
        case 'C1':
            Machine.Time_pin('c1', function (res, resp) {
                console.log('c1 time pin');
            });
            break;
        case 'd1':
        case 'D1':
            Machine.Time_pin('d1', function (res, resp) {
                console.log('d1 time pin');
            });
            break;
        case 'e1':
        case 'E1':
            Machine.Time_pin('e1', function (res, resp) {
                console.log('e1 time pin');
            });
            break;
        case 'F1':
        case 'f1':
            Machine.Time_pin('f1', function (res, resp) {
                console.log('f1 time pin');
            });
            break;
        case 'a2':
        case 'A2':
            Machine.Time_pin('a2', function (res, resp) {
                console.log('A2 time pin');
            });
            break;
        case 'b2':
        case 'B2':
            Machine.Time_pin('b2', function (res, resp) {
                console.log('b2 time pin');
            });
            break;
        case 'c2':
        case 'C2':
            Machine.Time_pin('c2', function (res, resp) {
                console.log('c2 time pin');
            });
            break;
        case 'd2':
        case 'D2':
            Machine.Time_pin('d2', function (res, resp) {
                console.log('d2 time pin');
            });
            break;
        case 'e2':
        case 'E2':
            Machine.Time_pin('e2', function (res, resp) {
                console.log('e2 time pin');
            });
            break;
        case 'f2':
        case 'F2':
            Machine.Time_pin('f2', function (res, resp) {
                console.log('f2 time pin');
            });
            break;
        case 'a3':
        case 'A3':
            Machine.Time_pin('a3', function (res, resp) {
                console.log('A3 time pin');
            });
            break;
        case 'b3':
        case 'B3':
            Machine.Time_pin('b3', function (res, resp) {
                console.log('b3 time pin');
            });
            break;
        case 'c3':
        case 'C3':
            Machine.Time_pin('c3', function (res, resp) {
                console.log('c3 time pin');
            });
            break;
        case 'd3':
        case 'D3':
            Machine.Time_pin('d3', function (res, resp) {
                console.log('d3 time pin');
            });
            break;
        case 'e3':
        case 'E3':
            Machine.Time_pin('e3', function (res, resp) {
                console.log('e3 time pin');
            });
            break;
        case 'f3':
        case 'F3':
            Machine.Time_pin('f3', function (res, resp) {
                console.log('e3 time pin');
            });
            break;
        case 'a4':
        case 'A4':
            Machine.Time_pin('a4', function (res, resp) {
                console.log('A4 time pin');
            });
            break;
        case 'b4':
        case 'B4':
            Machine.Time_pin('b4', function (res, resp) {
                console.log('b4 time pin');
            });
            break;
        case 'c4':
        case 'C4':
            Machine.Time_pin('c4', function (res, resp) {
                console.log('c4 time pin');
            });
            break;
        case 'd4':
        case 'D4':
            Machine.Time_pin('d4', function (res, resp) {
                console.log('d4 time pin');
            });
            break;
        case 'e4':
        case 'E4':
            Machine.Time_pin('e4', function (res, resp) {
                console.log('e4 time pin');
            });
            break;
        case 'f4':
        case 'F4':
            Machine.Time_pin('f4', function (res, resp) {
                console.log('f4 time pin');
            });
            break;
        case 'a5':
        case 'A5':
            Machine.Time_pin('a5', function (res, resp) {
                console.log('A5 time pin');
            });
            break;
        case 'b5':
        case 'B5':
            Machine.Time_pin('b5', function (res, resp) {
                console.log('b5 time pin');
            });
            break;
        case 'c5':
        case 'C5':
            Machine.Time_pin('c5', function (res, resp) {
                console.log('c5 time pin');
            });
            break;
        case 'd5':
        case 'D5':
            Machine.Time_pin('d5', function (res, resp) {
                console.log('d5 time pin');
            });
            break;
        case 'e5':
        case 'E5':
            Machine.Time_pin('e5', function (res, resp) {
                console.log('e5 time pin');
            });
            break;
        case 'F5':
        case 'f5':
            Machine.Time_pin('f5', function (res, resp) {
                console.log('f5 time pin');
            });
            break;
        case 'a6':
        case 'A6':
            Machine.Time_pin('a6', function (res, resp) {
                console.log('A6 time pin');
            });
            break;
        case 'b6':
        case 'B6':
            Machine.Time_pin('b6', function (res, resp) {
                console.log('b6 time pin');
            });
            break;
        case 'c6':
        case 'C6':
            Machine.Time_pin('c6', function (res, resp) {
                console.log('c6 time pin');
            });
            break;
        case 'd6':
        case 'D6':
            Machine.Time_pin('d6', function (res, resp) {
                console.log('d6 time pin');
            });
            break;
        case 'e6':
        case 'E6':
            Machine.Time_pin('e6', function (res, resp) {
                console.log('e6 time pin');
            });
            break;
        case 'f6':
        case 'F6':
            Machine.Time_pin('f6', function (res, resp) {
                console.log('f6 time pin');
            });
            break;
        case 'a7':
        case 'A7':
            Machine.Time_pin('a7', function (res, resp) {
                console.log('A7 time pin');
            });
            break;
        case 'b7':
        case 'B7':
            Machine.Time_pin('b7', function (res, resp) {
                console.log('b7 time pin');
            });
            break;
        case 'c7':
        case 'C7':
            Machine.Time_pin('c7', function (res, resp) {
                console.log('c7 time pin');
            });
            break;
        case 'd7':
        case 'D7':
            Machine.Time_pin('d7', function (res, resp) {
                console.log('d7 time pin');
            });
            break;
        case 'e7':
        case 'E7':
            Machine.Time_pin('e7', function (res, resp) {
                console.log('e7 time pin');
            });
            break;
        case 'F7':
        case 'f7':
            Machine.Time_pin('f7', function (res, resp) {
                console.log('f7 time pin');
            });
            break;
        case 'a8':
        case 'A8':
            Machine.Time_pin('a8', function (res, resp) {
                console.log('A8 time pin');
            });
            break;
        case 'b8':
        case 'B8':
            Machine.Time_pin('b8', function (res, resp) {
                console.log('b8 time pin');
            });
            break;
        case 'c8':
        case 'C8':
            Machine.Time_pin('c8', function (res, resp) {
                console.log('c8 time pin');
            });
            break;
        case 'd8':
        case 'D8':
            Machine.Time_pin('d8', function (res, resp) {
                console.log('d8 time pin');
            });
            break;
        case 'e8':
        case 'E8':
            Machine.Time_pin('e8', function (res, resp) {
                console.log('e8 time pin');
            });
            break;
        case 'f8':
        case 'F8':
            Machine.Time_pin('f8', function (res, resp) {
                console.log('f8 time pin');
            });
            break;
        case 'a9':
        case 'A9':
            Machine.Time_pin('a9', function (res, resp) {
                console.log('A9 time pin');
            });
            break;
        case 'b9':
        case 'B9':
            Machine.Time_pin('b9', function (res, resp) {
                console.log('b9 time pin');
            });
            break;
        case 'c9':
        case 'C9':
            Machine.Time_pin('c9', function (res, resp) {
                console.log('c9 time pin');
            });
            break;
        case 'd9':
        case 'D9':
            Machine.Time_pin('d9', function (res, resp) {
                console.log('d9 time pin');
            });
            break;
        case 'e9':
        case 'E9':
            Machine.Time_pin('e9', function (res, resp) {
                console.log('e9 time pin');
            });
            break;
        case 'F9':
        case 'f9':
            Machine.Time_pin('f9', function (res, resp) {
                console.log('f9 time pin');
            });
            break;
        case 'a0':
        case 'A0':
            Machine.Time_pin('a0', function (res, resp) {
                console.log('A0 time pin');
            });
            break;
        case 'b0':
        case 'B0':
            Machine.Time_pin('b0', function (res, resp) {
                console.log('b0 time pin');
            });
            break;
        case 'c0':
        case 'C0':
            Machine.Time_pin('c0', function (res, resp) {
                console.log('c0 time pin');
            });
            break;
        case 'd0':
        case 'D0':
            Machine.Time_pin('d0', function (res, resp) {
                console.log('d0 time pin');
            });
            break;
        case 'e0':
        case 'E0':
            Machine.Time_pin('e0', function (res, resp) {
                console.log('e0 time pin');
            });
            break;
        case 'f0':
        case 'F0':
            Machine.Time_pin('f0', function (res, resp) {
                console.log('f0 time pin');
            });
            break;
    }
});
