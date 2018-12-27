/// <reference types="node" />
import Event from 'events';
import { callback } from "./Interfaces";
export declare class ControllerMachine extends Event {
    private Log;
    private mcp1;
    private mcp2;
    private stateMachine;
    private currentProcess;
    constructor();
    private securityState;
    private initOuts;
    private initSensors;
    private resetSensors;
    closeSensors: (callback: any) => void;
    stopAll: () => void;
    private findElevator;
    private checkPosition;
    motorStartDown: () => void;
    motorStartUp: () => void;
    motorStop: () => void;
    motorCintaStart: (row: number, coll: number, coll2: number) => void;
    motorCintaStop: (row: number, coll: number, coll2: number) => void;
    private emitSecurityAlert;
    private controlSensors;
    private manualController;
    private mainSignal;
    GoTo: (callback: any, row: number) => void;
    private prepareForDispense;
    private waitForRemoveItem;
    dispenseItem: (piso: number, c1: number, c2: number | null, height: number, callback: callback) => void;
    private findRow;
    private gotoInitPosition;
    private dispense;
    private controlTime;
    private controlBlocking;
    private testCeldas;
    private findElevatorBeta;
}
