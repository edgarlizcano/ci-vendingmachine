/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Input extends event.EventEmitter {
    constructor(_principal: any);
    Principal: any;
    private Is_pin_ok;
    private P1;
    private P2;
    private P3;
    private P4;
    private P5;
    private P6;
    private SM;
    Open: () => void;
    Close: (cb: callback) => void;
    initial_elevator: () => void;
    initial_elevator_call: (data: null, cb: callback) => void;
    private readInput_InP1;
    private readInput_InP2;
    private readInput_InP3;
    private readInput_InP4;
    private readInput_InP5;
    private readInput_InP6;
    private initial_pin;
    pollcbsensor: (pin: number, state: boolean) => void;
    Emit: (state: boolean, pin: number) => void;
}
