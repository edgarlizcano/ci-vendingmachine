/// <reference types="node" />
import Event from 'events';
export declare class ControllerMachine extends Event {
    private Log;
    private mcp1;
    private mcp2;
    private position;
    private goingTo;
    private motorState;
    private dispense;
    constructor();
    private checkPosition;
    private initOuts;
    stopAll: () => void;
    private motorStartDown;
    private motorStartUp;
    motorStop: () => void;
    motorCintaStart: (row: number, coll: number) => void;
    motorCintaStop: (row: number, coll: number) => void;
    signal: (pin: number, state: boolean) => void;
    GoTo: (row: number) => void;
    dispenseItem: (row: number, coll: number, timewait: number) => void;
}
