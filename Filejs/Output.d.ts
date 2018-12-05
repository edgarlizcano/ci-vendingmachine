/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Output extends event.EventEmitter {
    constructor();
    private mcp;
    private mcp1;
    private column;
    InitOut: (cb: callback) => void;
    private InitOut1;
    private InitOut2;
    private Select_Colunm;
    private Select_Colunm_low;
    HIGH: (data: string, cb: callback) => void;
    LOW: (data: string, cb: callback) => void;
    ChangeOutputStatus: (data: any) => void;
    motorDown: (cb: callback) => void;
    motorUP: (cb: any) => void;
    init_enable: (cb: any) => void;
    motoroff: (cb: any) => void;
    stop_all_Pin: (cb: any) => void;
    stop_all: (cb: any) => void;
    timepin: (data: string, time: number, cb: any) => void;
}
