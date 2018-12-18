/// <reference types="node" />
declare let stdin: NodeJS.Socket;
declare var options: {
    weekday: string;
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
};
declare let date: Date;
declare let datetime: string;
declare function menu(): void;
declare function controlTime(dato: number, location: number, goingto: number, callback: any): void;
declare let atasco: boolean;
declare let intentos: number;
declare function controlAtasco(state: number, callback: any): void;
