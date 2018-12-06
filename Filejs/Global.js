"use strict";
var global = {};
global.Sensor = {
    S1: { GPIO: 13, PIN: 33 },
    S2: { GPIO: 6, PIN: 31 },
    S3: { GPIO: 5, PIN: 29 },
    S4: { GPIO: 21, PIN: 40 },
    S5: { GPIO: 20, PIN: 38 },
    S6: { GPIO: 16, PIN: 36 },
    SM: { GPIO: 7, PIN: 26 }
};
global.State_Machine = {
    No_task: 1,
    Go_to_level: 2,
    Dispensing_product: 3,
    In_level: 4,
    Init_location: 5,
    Is_sale: 6,
    Go_to_Init_location: 7,
    Go_to_finish_location: 8,
    Go_to_Init_location_ERROR: 9,
    atasco: 10,
};
global.Pulso = {
    P1: { GPIO: 17, PIN: 11, text: "Piso_1 " },
    P2: { GPIO: 27, PIN: 13, text: "Piso_2 " },
    P3: { GPIO: 22, PIN: 15, text: "Piso_3 " },
    P4: { GPIO: 10, PIN: 19, text: "Piso_4 " },
    P5: { GPIO: 9, PIN: 21, text: "Piso_5 " },
    P6: { GPIO: 11, PIN: 23, text: "Piso_6 " },
};
global.Aux = {
    A1: { GPIO: 19, PIN: 35 },
    A2: { GPIO: 12, PIN: 32 }
};
global.Card = {
    Int: { GPIO: 24, PIN: 18 },
    Out: { GPIO: 23, PIN: 16 }
};
global.elevator = {
    Up: { GPIO: 8, PIN: 24 },
    Down: { GPIO: 18, PIN: 12 }
};
global.general = {
    stop: { GPIO: 50, PIN: 80 }
};
global.motoresPiso = {
    A: { A1: 'a1', A2: 'a2', A3: 'a3', A4: 'a4', A5: 'a5', A6: 'a6', A7: 'a7', A8: 'a8', A9: 'a9', A0: 'a0' },
    B: { B1: 'b1', B2: 'b2', B3: 'b3', B4: 'b4', B5: 'b5', B6: 'b6', B7: 'b7', B8: 'b8', B9: 'b9', B0: 'b0' },
    C: { C1: 'c1', C2: 'c2', C3: 'c3', C4: 'c4', C5: 'c5', C6: 'c6', C7: 'c7', C8: 'c8', C9: 'c9', C0: 'c0' },
    D: { D1: 'd1', D2: 'd2', D3: 'd3', D4: 'd4', D5: 'd5', D6: 'd6', D7: 'd7', D8: 'd8', D9: 'd9', D0: 'd0' },
    E: { E1: 'e1', E2: 'e2', E3: 'e3', E4: 'e4', E5: 'e5', E6: 'e6', E7: 'e7', E8: 'e8', E9: 'e9', E0: 'e0' },
    F: { F1: 'f1', F2: 'f2', F3: 'f3', F4: 'f4', F5: 'f5', F6: 'f6', F7: 'f7', F8: 'f8', F9: 'f9', F0: 'f0' }
};
global.MCP_row = {
    F: { MCP: 1, value: 10, text: "Piso_F ", status: false, ID: 'F' },
    E: { MCP: 1, value: 13, text: "Piso_E ", status: false, ID: 'E' },
    D: { MCP: 1, value: 12, text: "Piso_D ", status: false, ID: 'D' },
    C: { MCP: 1, value: 11, text: "Piso_C ", status: false, ID: 'C' },
    B: { MCP: 1, value: 14, text: "Piso_B ", status: false, ID: 'B' },
    A: { MCP: 1, value: 15, text: "Piso_A ", status: false, ID: 'A' }
};
global.machinelocation = 7;
global.MCP_Columna = {
    1: { MCP: 1, value: 0, text: "Columna_1  ", status: false, ID: 1 },
    2: { MCP: 1, value: 9, text: "Columna_2  ", status: false, ID: 2 },
    3: { MCP: 1, value: 8, text: "Columna_3  ", status: false, ID: 3 },
    4: { MCP: 1, value: 7, text: "Columna_4  ", status: false, ID: 4 },
    5: { MCP: 1, value: 6, text: "Columna_5  ", status: false, ID: 5 },
    6: { MCP: 1, value: 5, text: "Columna_6  ", status: false, ID: 6 },
    7: { MCP: 1, value: 4, text: "Columna_7  ", status: false, ID: 7 },
    8: { MCP: 1, value: 3, text: "Columna_8  ", status: false, ID: 8 },
    9: { MCP: 1, value: 2, text: "Columna_9  ", status: false, ID: 9 },
    10: { MCP: 1, value: 1, text: "Columna_10 ", status: false, ID: 0 }
};
global.MCP_Motor = {
    UP: { MCP: 2, value: 0, text: "Motor Up ", status: false, ID: 1 },
    Down: { MCP: 2, value: 2, text: "Motor Down ", status: false, ID: 2 },
    ENABLE: { MCP: 2, value: 1, text: "Enable ", status: false, ID: 0 },
};
global.mux = {
    Mux_1: { MCP: 2, value: 8, text: "Mux_1", status: false, ID: 0 },
    Mux_2: { MCP: 2, value: 9, text: "Mux_2", status: false, ID: 1 }
    /*  Mux_1: {value: 7, status: false, text: "Mux_1",ID:1},
      Mux_2: {value: 12, status: false, text: "Mux_2",ID:1}*/
};
global.state = {
    elevator: 0 //state 0 regresa a posición inicial parte inferior//state 1 asesor en operación //
};
global.result = {};
global.result.OK = { value: 0, text: "OK" };
global.result.ERROR_STOP_lOCATION = { value: 1, text: "NO FUE POSIBLE DETENER EL MOTOR AL UBICAR" };
global.result.ERROR_INIT_GPIO = { value: 2, text: "ERROR AL INICALIZAR LOS PINES DE LAS RASPBERRY" };
global.result.ERROR_READ_PIN_SM = { value: 3, text: "ERROR AL LEER FIN DE CARRERA EN LA POSICION INFERIOR" };
global.result.ERROR_DISPENSING_LEVEL = { value: 4, text: "ERROR AL UBICAR LA BANDEJA EN LA POCISIÓN PARA DISPENSAR" };
global.result.ERROR_RECEIVE_PRODUCT = { value: 6, text: "ERROR EN LA ESPERA DE RECOGER PRODUCTO" };
global.result.EXCEPTION = { value: 106, text: "EXCEPCION NO CONTROLADA", stack: '' };
global.Type_of_product = {
    small: 1,
    big: 2,
};
global.Product_is = 1;
global.Product_long = 5;
global.Is_empty = true;
global.Time_wait_for_up_level = 10000;
global.Time_wait_for_up_level_F = 4000;
global.Time_wait_for_up_level_E = 5000;
global.Time_wait_for_up_level_D = 6000;
global.Time_wait_for_up_level_C = 7000;
global.Time_wait_for_up_level_B = 8000;
global.Time_wait_for_up_level_A = 9000;
global.number_atasco = 0;
global.logger = '';
global.Time_wait_for_dispensing = 10000;
global.Time_wait_to_receive = 150;
global.Time_down_to_dispensing_small = 250;
global.Time_down_to_dispensing_big = 300;
global.active_dispensing = false;
global.motoresCelda = {
    A1: { row: 15, coll: 1 },
    A2: { row: 15, coll: 2 },
    A3: { row: 15, coll: 3 },
    A4: { row: 15, coll: 4 },
    A5: { row: 15, coll: 5 },
    A6: { row: 15, coll: 6 },
    A7: { row: 15, coll: 7 },
    A8: { row: 15, coll: 8 },
    A9: { row: 15, coll: 9 },
    A0: { row: 15, coll: 0 },
    B1: { row: 14, coll: 1 },
    B2: { row: 14, coll: 2 },
    B3: { row: 14, coll: 3 },
    B4: { row: 14, coll: 4 },
    B5: { row: 14, coll: 5 },
    B6: { row: 14, coll: 6 },
    B7: { row: 14, coll: 7 },
    B8: { row: 14, coll: 8 },
    B9: { row: 14, coll: 9 },
    B0: { row: 14, coll: 0 },
    C1: { row: 11, coll: 1 },
    C2: { row: 11, coll: 2 },
    C3: { row: 11, coll: 3 },
    C4: { row: 11, coll: 4 },
    C5: { row: 11, coll: 5 },
    C6: { row: 11, coll: 6 },
    C7: { row: 11, coll: 7 },
    C8: { row: 11, coll: 8 },
    C9: { row: 11, coll: 9 },
    C0: { row: 11, coll: 0 },
    D1: { row: 12, coll: 1 },
    D2: { row: 12, coll: 2 },
    D3: { row: 12, coll: 3 },
    D4: { row: 12, coll: 4 },
    D5: { row: 12, coll: 5 },
    D6: { row: 12, coll: 6 },
    D7: { row: 12, coll: 7 },
    D8: { row: 12, coll: 8 },
    D9: { row: 12, coll: 9 },
    D0: { row: 12, coll: 0 },
    E1: { row: 13, coll: 1 },
    E2: { row: 13, coll: 2 },
    E3: { row: 13, coll: 3 },
    E4: { row: 13, coll: 4 },
    E5: { row: 13, coll: 5 },
    E6: { row: 13, coll: 6 },
    E7: { row: 13, coll: 7 },
    E8: { row: 13, coll: 8 },
    E9: { row: 13, coll: 9 },
    E0: { row: 13, coll: 0 },
    F1: { row: 10, coll: 1 },
    F2: { row: 10, coll: 2 },
    F3: { row: 10, coll: 3 },
    F4: { row: 10, coll: 4 },
    F5: { row: 10, coll: 5 },
    F6: { row: 10, coll: 6 },
    F7: { row: 10, coll: 7 },
    F8: { row: 10, coll: 8 },
    F9: { row: 10, coll: 9 },
    F0: { row: 10, coll: 0 },
};
module.exports = global;
