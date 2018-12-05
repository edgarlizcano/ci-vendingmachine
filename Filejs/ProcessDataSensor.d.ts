/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class ProcessDataSensor extends event.EventEmitter {
    constructor();
    private serialdata;
    private buffer;
    private reference;
    private array;
    private array1;
    private res;
    private long;
    private CRC;
    private state;
    private BufferIn;
    private ReadyData;
    private Trama_IN;
    private Trama_POOL;
    private Trama_STATE;
    private baudRate;
    private port;
    CheckPortOpen: (data: any, cb: callback) => void;
    private check_open_port;
    Open_port: (data: any, callback: callback) => void;
    private EventSerialData;
    private Validate;
    private CRC_Vending_Machine;
    SendComand: (txt: null, cb: callback) => void;
    SendComand_check: (txt: null, cb: callback) => void;
    private SendComand_;
    private POOLSTATE;
    private waitForReadyData;
}
