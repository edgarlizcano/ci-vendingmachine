/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Reader extends event.EventEmitter {
    constructor();
    private Reader;
    private Mux;
    Open_Port: (data: any, cb: callback) => void;
    CheckReader: (data: any, cb: callback) => void;
    WriteCard: (data: any, cb: callback) => void;
    ReadCard: (data: any, cb: callback) => void;
    GetIdCard: (cb: callback) => void;
}
