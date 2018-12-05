/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Sensor extends event.EventEmitter {
    constructor();
    private Sensorcomand;
    private Mux;
    private data;
    Check_Sensor: (data: any, callback: callback) => void;
    Get_state: (callback: callback) => void;
    Open_port: (data: any, callback: callback) => void;
}
