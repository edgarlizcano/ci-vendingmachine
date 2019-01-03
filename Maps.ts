let Maps: any = {};

//Sensores
Maps.Sensor = {
    1:      {Piso:1, GPIO:13, PIN:  33, test: false},
    2:      {Piso:2, GPIO: 6, PIN:  31, test: false},
    3:      {Piso:3, GPIO: 5, PIN:  29, test: false},
    4:      {Piso:4, GPIO:21, PIN:  40, test: false},
    5:      {Piso:5, GPIO:20, PIN:  38, test: false},
    6:      {Piso:6, GPIO:16, PIN:  36, test: false},
    7:      {Piso:7, GPIO: 7, PIN:  26, test: false}
};

//pines de señales pulso de cambio de vuelta
Maps.Pulso = {
    P1:      {GPIO :17,  PIN:  11, text: "Piso_1 "},
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

Maps.row= {
    7:  {Piso: 7, PIN: 26},
    6:  {Piso: 6, PIN: 10},
    5:  {Piso: 5, PIN: 13},
    4:  {Piso: 4, PIN: 12},
    3:  {Piso: 3, PIN: 11},
    2:  {Piso: 2, PIN: 14},
    1:  {Piso: 1, PIN: 15}
};
Maps.column= {
    1:   {PIN: 0},
    2:   {PIN: 9},
    3:   {PIN: 8},
    4:   {PIN: 7},
    5:   {PIN: 6},
    6:   {PIN: 5},
    7:   {PIN: 4},
    8:   {PIN: 3},
    9:   {PIN: 2},
    10:  {PIN: 1}
};

Maps.Is_empty =true;

export = Maps;