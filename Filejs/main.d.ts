/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Main extends event.EventEmitter {
    constructor();
    private Test;
    private _Sensor;
    private Compra;
    private _Reader;
    private Out_;
    state_Machine: number;
    Is_init_location: boolean;
    Is_empty: boolean;
    Up_elevator: (cb: callback) => void;
    Down_elevator: (cb: callback) => void;
    off_elevator: (cb: callback) => void;
    Testmotores: (cb: any) => void;
    TestmotoresPiso: (Piso: string, cb: any) => void;
    GotoLevel: (data: string, cb: any) => void;
    Sale: (data: string, cb: any) => void;
    Sale_big: (data: string, cb: any) => void;
    Close: (cb: any) => void;
    Open: (cb: any) => void;
    Time_pin: (data: string, cb: any) => void;
    Open_Port: (data: any, cb: any) => void;
    CheckReader: (data: any, cb: any) => void;
    GetIdCard: (cb: any) => void;
    Check_Sensor: (data: any, cb: any) => void;
    Open_port: (data: any, cb: any) => void;
    Get_state: (cb: any) => void;
    Is_dispensing: (data: any) => void;
    Is_busy: (data: any) => void;
    Atasco: () => void;
    clean_pin: (cb: any) => void;
}
