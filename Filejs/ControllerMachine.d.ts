/// <reference types="node" />
import Event from 'events';
import { callback } from "./Interfaces";
export declare class ControllerMachine extends Event {
    private Log;
    private mcp1;
    private mcp2;
    private goingTo;
    private motorState;
    private dispense;
    constructor();
    private findElevator;
    private checkPosition;
    private initOuts;
    private initSensors;
    closeSensors: (cb: callback) => void;
    stopAll: () => void;
    private motorStartDown;
    private motorStartUp;
    motorStop: () => void;
    private motorCintaStart;
    private motorCintaStop;
    private signal;
    GoTo: (row: number) => void;
    private waitPosition;
    private prepareForDispense;
    private receiveItem;
    dispenseItem: (piso: number, row: number, coll: number, height: number) => void;
}
