/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Mux_class extends event.EventEmitter {
    constructor();
    private readermux;
    private sensormux;
    private _out;
    SetReader: (tx: null, cb: callback) => void;
    SetSensor: (tx: null, cb: callback) => void;
}
