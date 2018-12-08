let Maps: any = {};

Maps.Sensor = {
    S1:      {Piso:1, GPIO:13, PIN:  33, test: false},
    S2:      {Piso:2, GPIO: 6, PIN:  31, test: false},
    S3:      {Piso:3, GPIO: 5, PIN:  29, test: false},
    S4:      {Piso:4, GPIO:21, PIN:  40, test: false},
    S5:      {Piso:5, GPIO:20, PIN:  38, test: false},
    S6:      {Piso:6, GPIO:16, PIN:  36, test: false},
    SM:      {Piso:7, GPIO: 7, PIN:  26, test: false}
};

Maps.Pulso = {
    P1:      {GPIO :17,  PIN:  11, text: "Piso_1 "},//pines de señales pulso de cambio de vuelta
    P2:      {GPIO :27,  PIN:  13, text: "Piso_2 "},
    P3:      {GPIO :22,  PIN:  15, text: "Piso_3 "},
    P4:      {GPIO :10,  PIN:  19, text: "Piso_4 "},
    P5:      {GPIO :9,   PIN:  21, text: "Piso_5 "},
    P6:      {GPIO :11,  PIN:  23, text: "Piso_6 "},
};

Maps.Aux = {
    A1:      {GPIO:19, PIN:  35},
    A2:      {GPIO:12, PIN:  32}
};

Maps.Card = {
    Int:      {GPIO:24, PIN:  18},
    Out:      {GPIO:23, PIN:  16}
};

Maps.elevator  = {
    Up:      {GPIO: 8, PIN:  24},
    Down:    {GPIO:18, PIN:  12}
};

Maps.general  = {
    stop:      {GPIO: 50, PIN:  80}
};

Maps.MachineLocation= null;

Maps.MCP_Motor= {
    UP    :  {MCP: 2, value: 0, text: "Motor Up ",  status: false, ID:1},
    Down  :  {MCP: 2, value: 2, text: "Motor Down ",status: false, ID:2},
    ENABLE:  {MCP: 2, value: 1, text: "Enable ",    status: false, ID:0},
};

Maps.mux={
    Mux_1:  {MCP: 2, value: 8, text: "Mux_1",status: false, ID:0},
    Mux_2:  {MCP: 2, value: 9, text: "Mux_2",status: false, ID:1}
};

Maps.motoresCelda = {
    A1:{piso:1, row:15, coll:1},
    A2:{piso:1, row:15, coll:2},
    A3:{piso:1, row:15, coll:3},
    A4:{piso:1, row:15, coll:4},
    A5:{piso:1, row:15, coll:5},
    A6:{piso:1, row:15, coll:6},
    A7:{piso:1, row:15, coll:7},
    A8:{piso:1, row:15, coll:8},
    A9:{piso:1, row:15, coll:9},
    A0:{piso:1, row:15, coll:0},
    B1:{piso:2, row:14, coll:1},
    B2:{piso:2, row:14, coll:2},
    B3:{piso:2, row:14, coll:3},
    B4:{piso:2, row:14, coll:4},
    B5:{piso:2, row:14, coll:5},
    B6:{piso:2, row:14, coll:6},
    B7:{piso:2, row:14, coll:7},
    B8:{piso:2, row:14, coll:8},
    B9:{piso:2, row:14, coll:9},
    B0:{piso:2, row:14, coll:0},
    C1:{piso:3, row:11, coll:1},
    C2:{piso:3, row:11, coll:2},
    C3:{piso:3, row:11, coll:3},
    C4:{piso:3, row:11, coll:4},
    C5:{piso:3, row:11, coll:5},
    C6:{piso:3, row:11, coll:6},
    C7:{piso:3, row:11, coll:7},
    C8:{piso:3, row:11, coll:8},
    C9:{piso:3, row:11, coll:9},
    C0:{piso:3, row:11, coll:0},
    D1:{piso:4, row:12, coll:1},
    D2:{piso:4, row:12, coll:2},
    D3:{piso:4, row:12, coll:3},
    D4:{piso:4, row:12, coll:4},
    D5:{piso:4, row:12, coll:5},
    D6:{piso:4, row:12, coll:6},
    D7:{piso:4, row:12, coll:7},
    D8:{piso:4, row:12, coll:8},
    D9:{piso:4, row:12, coll:9},
    D0:{piso:4, row:12, coll:0},
    E1:{piso:5, row:13, coll:1},
    E2:{piso:5, row:13, coll:2},
    E3:{piso:5, row:13, coll:3},
    E4:{piso:5, row:13, coll:4},
    E5:{piso:5, row:13, coll:5},
    E6:{piso:5, row:13, coll:6},
    E7:{piso:5, row:13, coll:7},
    E8:{piso:5, row:13, coll:8},
    E9:{piso:5, row:13, coll:9},
    E0:{piso:5, row:13, coll:0},
    F1:{piso:6, row:10, coll:1},
    F2:{piso:6, row:10, coll:2},
    F3:{piso:6, row:10, coll:3},
    F4:{piso:6, row:10, coll:4},
    F5:{piso:6, row:10, coll:5},
    F6:{piso:6, row:10, coll:6},
    F7:{piso:6, row:10, coll:7},
    F8:{piso:6, row:10, coll:8},
    F9:{piso:6, row:10, coll:9},
    F0:{piso:6, row:10, coll:0},
};

Maps.row= {
    M:  {Piso: 7, MCP: 1, value: 10, text: "Piso_Principal ",status: false, ID:'M'},
    F:  {Piso: 6, MCP: 1, value: 10, text: "Piso_F ",status: false, ID:'F'},
    E:  {Piso: 5, MCP: 1, value: 13, text: "Piso_E ",status: false, ID:'E'},
    D:  {Piso: 4, MCP: 1, value: 12, text: "Piso_D ",status: false, ID:'D'},
    C:  {Piso: 3, MCP: 1, value: 11, text: "Piso_C ",status: false, ID:'C'},
    B:  {Piso: 2, MCP: 1, value: 14, text: "Piso_B ",status: false, ID:'B'},
    A:  {Piso: 1, MCP: 1, value: 15, text: "Piso_A ",status: false, ID:'A'}
};

export = Maps;