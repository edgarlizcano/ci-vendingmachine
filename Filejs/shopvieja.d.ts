/// <reference types="node" />
import event from 'events';
import { callback } from "./Interfaces";
export declare class Shop extends event.EventEmitter {
    constructor(_principal: any);
    private Out1;
    private Input;
    Principal: any;
    private Is_pin;
    private Is_Location;
    private PisoA_ON;
    private PisoB_ON;
    private PisoC_ON;
    private PisoD_ON;
    private PisoE_ON;
    private PisoF_ON;
    private Is_sale_error;
    private Is_emit_event;
    ProcessEnv: (Pin: string) => void;
    Sale: (data: string, cb: callback) => void;
    private Sale_U;
    private wait_for_dispensing;
    private init_product;
    private wait_for_up;
    private empty;
    private Sale_column;
    private Sale_column_low;
    private Sale_steps;
    private preparing_to_dispense;
    private preparing_to_dispense_;
    private preparing_to_receive;
    private Go_level;
    GotoLevel: (data: string, cb: callback) => void;
    Ubicacion: (data: any, cb: callback) => void;
    init_location: (data: any, cb: callback) => void;
    Close: (cb: callback) => void;
    Open_: (cb: callback) => void;
    ProcessEnv_PIN: (Pin: string) => void;
}
