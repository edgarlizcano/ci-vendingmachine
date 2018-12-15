/// <reference types="node" />
declare let stdin: NodeJS.Socket;
declare function menu(): void;
declare function controlTime(dato: number, location: number, goingto: number, callback: any): void;
declare let atasco: boolean;
declare let intentos: number;
declare function controlAtasco(state: number, callback: any): void;
