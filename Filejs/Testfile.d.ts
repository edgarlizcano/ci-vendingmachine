/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Testfile extends event.EventEmitter {
    constructor();
    private Out1;
    private state;
    Testmotores: (cb: callback) => void;
    TestmotoresPiso: (Piso: string, cb: callback) => void;
}
