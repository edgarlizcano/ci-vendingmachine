/// <reference types="node" />
import Event from 'events';
import { callback } from "./Interfaces";
export declare class ControllerMachine extends Event {
    private Log;
    private mcp1;
    private mcp2;
    private goingTo;
    private motorState;
    private location;
    private sensorPiso;
    private receivingItem;
    private isDelivery;
    private enableMachine;
    private estatemachine;
    constructor();
    private initOuts;
    private initSensors;
    closeSensors: (cb: callback) => void;
    stopAll: () => void;
    private findElevator;
    private checkPosition;
    private motorStartDown;
    private motorStartUp;
    motorStop: () => void;
    motorCintaStart: (row: number, coll: number, coll2: number) => void;
    motorCintaStop: (row: number, coll: number, coll2: number) => void;
    private signal;
    GoTo: (callback: any, row: number) => void;
    private prepareForDispense;
    dispenseItem: (piso: number, c1: number, c2: number | null, height: number, callback: callback) => void;
    private findRow;
    private gotoInitPosition;
}
