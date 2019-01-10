"use strict";
var Config = {};
Config.floors = {
    1: { Enable: true },
    2: { Enable: true },
    3: { Enable: true },
    4: { Enable: true },
    5: { Enable: true },
    6: { Enable: true },
    7: { Enable: true }
};
//Configuración de Sensores
Config.Sensor = {
    1: { Piso: 1, GPIO: 13, PIN: 33 },
    2: { Piso: 2, GPIO: 6, PIN: 31 },
    3: { Piso: 3, GPIO: 5, PIN: 29 },
    4: { Piso: 4, GPIO: 21, PIN: 40 },
    5: { Piso: 5, GPIO: 20, PIN: 38 },
    6: { Piso: 6, GPIO: 16, PIN: 36 },
    7: { Piso: 7, GPIO: 7, PIN: 26 }
};
//pines de señales pulso de cambio de vuelta
Config.Pulso = {
    P1: { GPIO: 17, PIN: 11 },
    P2: { GPIO: 27, PIN: 13 },
    P3: { GPIO: 22, PIN: 15 },
    P4: { GPIO: 10, PIN: 19 },
    P5: { GPIO: 9, PIN: 21 },
    P6: { GPIO: 11, PIN: 23 },
};
Config.Aux = {
    A1: { GPIO: 19, PIN: 35 },
    A2: { GPIO: 12, PIN: 32 }
};
Config.Card = {
    Int: { GPIO: 24, PIN: 18 },
    Out: { GPIO: 23, PIN: 16 }
};
Config.elevator = {
    Up: { GPIO: 8, PIN: 24 },
    Down: { GPIO: 25, PIN: 22 }
};
Config.general = {
    Stop: { GPIO: 18, PIN: 12 }
};
Config.MCP_Motor = {
    UP: { MCP: 2, value: 0 },
    Down: { MCP: 2, value: 2 },
    ENABLE: { MCP: 2, value: 1 },
};
Config.mux = {
    Mux_1: { MCP: 2, value: 8, text: "Mux_1", status: false, ID: 0 },
    Mux_2: { MCP: 2, value: 9, text: "Mux_2", status: false, ID: 1 }
};
Config.row = {
    7: { Piso: 7, PIN: 26 },
    6: { Piso: 6, PIN: 10 },
    5: { Piso: 5, PIN: 13 },
    4: { Piso: 4, PIN: 12 },
    3: { Piso: 3, PIN: 11 },
    2: { Piso: 2, PIN: 14 },
    1: { Piso: 1, PIN: 15 }
};
Config.column = {
    1: { PIN: 0 },
    2: { PIN: 9 },
    3: { PIN: 8 },
    4: { PIN: 7 },
    5: { PIN: 6 },
    6: { PIN: 5 },
    7: { PIN: 4 },
    8: { PIN: 3 },
    9: { PIN: 2 },
    0: { PIN: 1 },
};
Config.times = {
    1: { timeToFloor: 15000 },
    2: { timeToFloor: 12000 },
    3: { timeToFloor: 10000 },
    4: { timeToFloor: 8000 },
    5: { timeToFloor: 6000 },
    6: { timeToFloor: 4000 },
    7: { timeToFloor: 12000 }
};
Config.Is_empty = false;
module.exports = Config;
