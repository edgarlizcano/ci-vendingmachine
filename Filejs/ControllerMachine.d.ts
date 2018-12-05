/// <reference types="node" />
import Event from 'events';
import { callback } from "./Interfaces";
export declare class ControllerMachine extends Event {
    private Log;
    private mcp1;
    private mcp2;
    private position;
    constructor();
    initOuts: (cb: callback) => void;
    stopAll: () => void;
    motorStartDown: (cb: callback) => void;
    motorStopDown: (cb: callback) => void;
    motorStartUp: (cb: callback) => void;
    motorStopUp: (cb: callback) => void;
    motorCinta: (row: number, coll: number, cb: callback) => void;
    signal: (pin: number, state: boolean) => void;
}
