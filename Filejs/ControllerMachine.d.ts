/// <reference types="node" />
import { EventEmitter } from 'events';
import { callback } from "./Interfaces";
export declare class ControllerMachine extends EventEmitter {
    private Log;
    private mcp1;
    private mcp2;
    private stateMachine;
    private times;
    constructor();
    private securityState;
    private initOuts;
    private initSensors;
    private resetSensors;
    closeSensors: (callback: any) => void;
    stopAll: (callback: any) => void;
    private findElevator;
    private checkPosition;
    motorStartDown: () => void;
    motorStartUp: () => void;
    motorStop: () => void;
    motorCintaStart: (row: number, coll: number, coll2: number | null) => void;
    motorCintaStop: (row: number, coll: number, coll2: number | null) => void;
    private emitSecurityAlert;
    private controlSensors;
    private manualController;
    private mainSignal;
    GoTo: (callback: any, row: number) => void;
    private prepareForDispense;
    private waitForRemoveItem;
    dispenseItem: (piso: number, c1: number, c2: number | null, height: number, callback: callback) => void;
    private gotoInitPosition;
    private dispense;
    private controlTime;
    private controlBlocking;
    private pollTimeProcess;
    pollSensor: (pin: number, callback: any) => void;
    testCeldas: (piso: number, coll_1: number, coll_2: any, callback: any) => void;
}
