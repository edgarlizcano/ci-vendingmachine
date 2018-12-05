/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Serial_Sensor extends event.EventEmitter {
    constructor();
    POLLSTATEDATA: (BufferIn: any, state: number, callback: callback) => void;
    private Resp_Check;
    private command_2;
    private Process_state;
}
