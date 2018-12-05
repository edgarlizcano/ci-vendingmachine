"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import global.logger from '@ci24/ci-logmodule';
var Global_1 = __importDefault(require("./Global"));
var events_1 = __importDefault(require("events"));
var Output_1 = require("./Output");
var Input_1 = require("./Input");
var async_1 = __importDefault(require("async"));
//let folderLogs = "/free/CI24/Logs/Machine/";
//global.logger.init(folderLogs);
var out1 = new Output_1.Output();
var Shop = /** @class */ (function (_super) {
    __extends(Shop, _super);
    function Shop(_principal) {
        var _this = _super.call(this) || this;
        _this.Out1 = out1;
        _this.Is_pin = '';
        _this.Is_Location = '';
        _this.PisoA_ON = 0;
        _this.PisoB_ON = 0;
        _this.PisoC_ON = 0;
        _this.PisoD_ON = 0;
        _this.PisoE_ON = 0;
        _this.PisoF_ON = 0;
        _this.Is_sale_error = false;
        _this.Is_emit_event = false;
        _this.ProcessEnv = function (Pin) {
            try {
                Global_1.default.logger.debug('Sensor   ' + Pin + '  activo' + '  estado de la maquina :   ' + _this.Principal.state_Machine);
                switch (Pin) {
                    case 'S1':
                        if (_this.Is_pin === 'A' || _this.Is_pin === 'a') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location);
                                });
                                _this.Ubicacion('2', function (err) {
                                    Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location);
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_finish_location) {
                                Global_1.default.logger.error('dirigiendose a pocisión de dispensar');
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level) {
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        _this.Principal.Is_init_location = false;
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else {
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        _this.Principal.Is_init_location = false;
                                        Global_1.default.logger.error('Elevador apagado pagado por sensor 1 ');
                                        _this.Ubicacion('4', function (err) {
                                            Global_1.default.logger.error('Enviando a ubicacion inical ' + _this.Is_Location + err);
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                        }
                        else {
                            _this.Out1.motoroff(function (err) {
                                if (err == null) {
                                    _this.Principal.Is_init_location = false;
                                    Global_1.default.logger.error('Elevador apagado pagado por sensor 1');
                                }
                                else {
                                    Global_1.default.logger.error('No fue posible detner motor');
                                }
                            });
                        }
                        break;
                    case 'S2':
                        if (_this.Is_pin === 'B' || _this.Is_pin === 'b') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level) {
                                _this.Principal.Is_init_location = false;
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location);
                                });
                                _this.Ubicacion('2', function (err) {
                                    Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location);
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                                Global_1.default.logger.warning('Sensor 2 activado sin  tarea');
                                _this.Principal.Is_init_location = false;
                            }
                        }
                        break;
                    case 'S3':
                        if (_this.Is_pin === 'C' || _this.Is_pin === 'c') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level) {
                                _this.Principal.Is_init_location = false;
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                                Global_1.default.logger.write('esta en niveeeeeeellllllll' + _this.Principal.state_Machine);
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                });
                                _this.Ubicacion('2', function (err) {
                                    Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location);
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                                Global_1.default.logger.warning('Sensor 3 activado sin  tarea');
                                _this.Principal.Is_init_location = false;
                            }
                        }
                        break;
                    case 'S4':
                        if (_this.Is_pin === 'D' || _this.Is_pin === 'd') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level) {
                                _this.Principal.Is_init_location = false;
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location);
                                    _this.Ubicacion('2', function (err) {
                                        Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location);
                                    });
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                                Global_1.default.logger.warning('Sensor 4 activado sin  tarea');
                                _this.Principal.Is_init_location = false;
                            }
                        }
                        break;
                    case 'S5':
                        if (_this.Is_pin === 'E' || _this.Is_pin === 'e') {
                            if (_this.Principal.state_Machine === Global_1.default.State_Machine.Go_to_level) {
                                _this.Principal.Is_init_location = false;
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location);
                                });
                                _this.Ubicacion('2', function (err) {
                                    Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location);
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                                Global_1.default.logger.warning('Sensor 5 activado sin  tarea');
                                _this.Principal.Is_init_location = false;
                            }
                        }
                        break;
                    case 'S6':
                        if (_this.Is_pin === 'F' || _this.Is_pin === 'f') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level) {
                                _this.Principal.Is_init_location = false;
                                _this.Out1.motoroff(function (err) {
                                    if (err == null) {
                                        Global_1.default.logger.write('Elevador apagado pagado ');
                                        _this.preparing_to_dispense(function (err) {
                                            if (err == null) {
                                                if (_this.Principal.state_Machine != Global_1.default.State_Machine.Dispensing_product) {
                                                    _this.Principal.state_Machine = Global_1.default.State_Machine.In_level;
                                                }
                                                Global_1.default.logger.write('motor preparado para dispensar');
                                            }
                                            else {
                                                Global_1.default.logger.error(err);
                                            }
                                        });
                                    }
                                    else {
                                        Global_1.default.logger.error('No fue posible detner motor');
                                    }
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                Global_1.default.logger.write('llega a dispensar producto');
                                _this.Principal.Is_init_location = false;
                                _this.Sale_column_low(_this.Is_Location, function (err) {
                                    Global_1.default.logger.write('Apagaaa' + _this.Is_Location);
                                });
                                _this.Ubicacion('2', function (err) {
                                    Global_1.default.logger.write('Enviando a ubicacion ' + _this.Is_Location + err);
                                });
                            }
                            else if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                                Global_1.default.logger.warning('Sensor 6 activado sin  tarea');
                                _this.Principal.Is_init_location = false;
                            }
                        }
                        break;
                    case 'SM':
                        if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_finish_location) {
                            _this.Principal.Is_init_location = true;
                            _this.Out1.motoroff(function (err) {
                                if (err == null) {
                                    _this.preparing_to_receive(function (err) {
                                        if (err == null) {
                                            _this.Principal.state_Machine = Global_1.default.State_Machine.No_task;
                                            Global_1.default.logger.write('Elevador apagado y en posición de entrega de producto' + err);
                                        }
                                        else {
                                            Global_1.default.logger.error('No fu posible detener el motor luego de preaparar para entregar');
                                        }
                                    });
                                }
                                else {
                                    Global_1.default.logger.error('No fue posible preparar para entregarr');
                                }
                            });
                        }
                        else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location) {
                            _this.Principal.Is_init_location = true;
                            _this.Out1.motoroff(function (err) {
                                if (err == null) {
                                    _this.preparing_to_receive(function (err) {
                                        if (err == null) {
                                            Global_1.default.logger.write('Elevador apagado pagado y en posición inicial ');
                                            _this.Principal.state_Machine = Global_1.default.State_Machine.Init_location;
                                        }
                                        else {
                                            Global_1.default.logger.error('No fu posible detener el motor luego de preaparar para entregar');
                                        }
                                    });
                                }
                                else {
                                    Global_1.default.logger.error(Global_1.default.result.ERROR_STOP_lOCATION);
                                }
                            });
                        }
                        else if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location_ERROR) {
                            _this.Principal.Is_init_location = true;
                            _this.Out1.motoroff(function (err) {
                                if (err == null) {
                                    _this.preparing_to_receive(function (err) {
                                        if (err == null) {
                                            Global_1.default.logger.write('Elevador apagado pagado y en posición inicial despues de no dispensar ');
                                            _this.Principal.state_Machine = Global_1.default.State_Machine.No_task;
                                        }
                                        else {
                                            Global_1.default.logger.error('No fu posible detener el motor luego de preaparar para entregar');
                                        }
                                    });
                                }
                                else {
                                    Global_1.default.logger.error(Global_1.default.result.ERROR_STOP_lOCATION);
                                }
                            });
                        }
                        else {
                            _this.Principal.Is_init_location = true;
                        }
                        break;
                }
                // }
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + 'Error al procesar evento');
            }
        };
        _this.Sale = function (data, cb) {
            try {
                Global_1.default.Product_is = 1;
                _this.Is_emit_event = false;
                _this.Is_sale_error = false;
                var pin = Array.from(data);
                switch (pin[0]) {
                    case 'a':
                    case 'A':
                        _this.Sale_steps('A', data, function (err) {
                            cb(err, 'Piso A');
                        });
                        _this.PisoA_ON = 0;
                        break;
                    case 'b':
                    case 'B':
                        _this.Sale_steps('B', data, function (err) {
                            cb(err, 'Piso B');
                        });
                        _this.PisoB_ON = 0;
                        break;
                    case 'c':
                    case 'C':
                        _this.Sale_steps('C', data, function (err) {
                            cb(err, 'Piso C');
                        });
                        _this.PisoC_ON = 0;
                        break;
                    case 'd':
                    case 'D':
                        _this.Sale_steps('D', data, function (err) {
                            cb(err, 'Piso D');
                        });
                        _this.PisoD_ON = 0;
                        break;
                    case 'e':
                    case 'E':
                        _this.Sale_steps('E', data, function (err) {
                            cb(err, 'Piso E');
                        });
                        _this.PisoE_ON = 0;
                        break;
                    case 'f':
                    case 'F':
                        _this.Sale_steps('F', data, function (err) {
                            cb(err, 'Piso F');
                        });
                        _this.PisoF_ON = 0;
                        break;
                    default:
                        cb('dato incorrecto');
                }
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Global_1.default.logger.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Sale_big = function (data, cb) {
            try {
                Global_1.default.Product_is = 2;
                _this.Is_emit_event = false;
                _this.Is_sale_error = false;
                var pin = Array.from(data);
                switch (pin[0]) {
                    case 'a':
                    case 'A':
                        _this.Sale_steps('A', data, function (err) {
                            cb(err, 'Piso A');
                        });
                        _this.PisoA_ON = 0;
                        break;
                    case 'b':
                    case 'B':
                        _this.Sale_steps('B', data, function (err) {
                            cb(err, 'Piso B');
                        });
                        _this.PisoB_ON = 0;
                        break;
                    case 'c':
                    case 'C':
                        _this.Sale_steps('C', data, function (err) {
                            cb(err, 'Piso C');
                        });
                        _this.PisoC_ON = 0;
                        break;
                    case 'd':
                    case 'D':
                        _this.Sale_steps('D', data, function (err) {
                            cb(err, 'Piso D');
                        });
                        _this.PisoD_ON = 0;
                        break;
                    case 'e':
                    case 'E':
                        _this.Sale_steps('E', data, function (err) {
                            cb(err, 'Piso E');
                        });
                        _this.PisoE_ON = 0;
                        break;
                    case 'f':
                    case 'F':
                        _this.Sale_steps('F', data, function (err) {
                            cb(err, 'Piso F');
                        });
                        _this.PisoF_ON = 0;
                        break;
                    default:
                        cb('dato incorrecto');
                }
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Global_1.default.logger.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Sale_U = function (location, cb) {
            var intervaldispensing = setInterval(function () {
                if (_this.Principal.state_Machine == Global_1.default.State_Machine.In_level) {
                    if (intervaldispensing != null) {
                        intervaldispensing = null;
                        clearInterval(intervaldispensing);
                        _this.Sale_column(_this.Is_Location, function (err) {
                            Global_1.default.logger.write('activa venta' + _this.Is_Location);
                            cb(err);
                        });
                    }
                }
                else if (_this.Principal.state_Machine == Global_1.default.State_Machine.atasco) {
                    if (intervaldispensing != null) {
                        intervaldispensing = null;
                        clearInterval(intervaldispensing);
                    }
                }
            }, 100);
        };
        _this.wait_for_dispensing = function () {
            var time_wait = Global_1.default.Time_wait_for_dispensing;
            var settimeout_wait = setTimeout(function () {
                if (intervalwait != null) {
                    intervalwait = null;
                    clearInterval(intervalwait);
                    _this.Sale_column_low(_this.Is_Location, function (err) {
                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                    });
                    _this.Ubicacion('3', function (err) {
                        Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                    });
                }
            }, time_wait);
            var intervalwait = setInterval(function () {
                if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_finish_location) {
                    if (intervalwait != null) {
                        intervalwait = null;
                        clearInterval(intervalwait);
                        clearInterval(settimeout_wait);
                    }
                }
            });
        };
        _this.init_product = function (data, cb) {
            Global_1.default.logger.fatal('llama a intervalo para dispensar ');
            var intervalproductend = setInterval(function () {
                if (_this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                    if (intervalproductend != null) {
                        intervalproductend = null;
                        clearInterval(intervalproductend);
                        if (_this.Is_sale_error == false) {
                            cb(null);
                            if (_this.Is_emit_event == false) {
                                _this.Principal.Is_dispensing(true);
                                _this.Is_emit_event = true;
                            }
                        }
                        else {
                            cb('no hay producto a dispensar');
                            if (_this.Is_emit_event == false) {
                                _this.Principal.Is_dispensing(false);
                                _this.Is_emit_event = true;
                            }
                        }
                    }
                }
            }, 100);
        };
        _this.wait_for_up = function (data) {
            var time_wait = Global_1.default.Time_wait_for_up_level;
            if (data !== null) {
                time_wait = data;
            }
            var settimeout_wait = setTimeout(function () {
                if (intervalwait != null) {
                    intervalwait = null;
                    clearInterval(intervalwait);
                    Global_1.default.logger.fatal('tiempo excedido afuera ');
                    if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_finish_location || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location_ERROR) {
                        Global_1.default.logger.fatal('tiempo excedido');
                        _this.Principal.Atasco();
                        _this.Principal.state_Machine = Global_1.default.State_Machine.atasco;
                        _this.Principal.Is_init_location = false;
                        _this.Out1.motoroff(function (err) {
                            if (err == null) {
                                Global_1.default.logger.write('Elevador apagado por posible atasco');
                                _this.Ubicacion('5', function (err) {
                                    Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                                });
                            }
                            else {
                                Global_1.default.logger.error('no es posible detener elevador luego de atasco ');
                            }
                        });
                    }
                }
            }, time_wait);
            var intervalwait = setInterval(function () {
                if (_this.Principal.state_Machine == Global_1.default.State_Machine.In_level || _this.Principal.state_Machine == Global_1.default.State_Machine.Init_location || _this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                    if (intervalwait != null) {
                        intervalwait = null;
                        clearInterval(settimeout_wait);
                        clearInterval(intervalwait);
                    }
                }
            }, 100);
        };
        _this.wait_for_up_select = function () {
            switch (_this.Is_pin) {
                case 'f':
                case 'F':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_F);
                    break;
                case 'E':
                case 'e':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_E);
                    break;
                case 'D':
                case 'd':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_D);
                    break;
                case 'c':
                case 'C':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_C);
                    break;
                case 'b':
                case 'B':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_B);
                    break;
                case 'a':
                case 'A':
                    _this.wait_for_up(Global_1.default.Time_wait_for_up_level_A);
                    break;
                default:
                    _this.wait_for_up(null);
            }
        };
        _this.wait_for_up_down = function (data) {
            var time_wait = Global_1.default.Time_wait_for_up_level;
            if (data !== null) {
                time_wait = data;
            }
            var settimeout_wait = setTimeout(function () {
                if (intervalwait != null) {
                    intervalwait = null;
                    clearInterval(intervalwait);
                    if (_this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_level || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_finish_location || _this.Principal.state_Machine == Global_1.default.State_Machine.Go_to_Init_location_ERROR) {
                        Global_1.default.logger.fatal('tiempo excedido');
                        _this.Principal.Atasco();
                        Global_1.default.number_atasco++;
                        _this.Principal.state_Machine = Global_1.default.State_Machine.atasco;
                        _this.Principal.Is_init_location = false;
                        _this.Out1.motoroff(function (err) {
                            if (err == null) {
                                if (Global_1.default.number_atasco < 2) {
                                    _this.Out1.motorUP(function (err) {
                                        if (err == null) {
                                            Global_1.default.logger.write('Elevador hacia arriba ' + err);
                                            setTimeout(function () {
                                                _this.Ubicacion('5', function (err) {
                                                    Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                                                });
                                            }, 1500);
                                        }
                                        else {
                                            Global_1.default.logger.error(Global_1.default.result.ERROR_DISPENSING_LEVEL.text);
                                        }
                                    });
                                }
                                else {
                                    _this.Out1.motoroff(function (err) {
                                        if (err == null) {
                                            Global_1.default.logger.error('elevador atascado ');
                                        }
                                        else {
                                            Global_1.default.logger.error('no es posible detener elevador luego de atasco ');
                                        }
                                    });
                                }
                                Global_1.default.logger.write('Elevador apagado por posible atasco');
                            }
                            else {
                                Global_1.default.logger.error('no es posible detener elevador luego de atasco ');
                            }
                        });
                    }
                }
            }, time_wait);
            var intervalwait = setInterval(function () {
                if (_this.Principal.state_Machine == Global_1.default.State_Machine.In_level || _this.Principal.state_Machine == Global_1.default.State_Machine.Init_location || _this.Principal.state_Machine == Global_1.default.State_Machine.No_task) {
                    if (intervalwait != null) {
                        intervalwait = null;
                        clearInterval(settimeout_wait);
                        clearInterval(intervalwait);
                    }
                }
            }, 100);
        };
        _this.wait_for_up_select_down = function () {
            switch (_this.Is_pin) {
                case 'f':
                case 'F':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_F);
                    break;
                case 'E':
                case 'e':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_E);
                    break;
                case 'D':
                case 'd':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_D);
                    break;
                case 'c':
                case 'C':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_C);
                    break;
                case 'b':
                case 'B':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_B);
                    break;
                case 'a':
                case 'A':
                    _this.wait_for_up_down(Global_1.default.Time_wait_for_up_level_A);
                    break;
                default:
                    _this.wait_for_up_down(null);
            }
        };
        _this.empty = function (data, cb) {
            Global_1.default.logger.debug('llega al interval');
            var cont = 0;
            setTimeout(function () {
                var intervalempty = setInterval(function () {
                    if (Global_1.default.Is_empty == true) {
                        if (intervalempty != null) {
                            intervalempty = null;
                            clearInterval(intervalempty);
                            cb(null);
                        }
                    }
                    else if (cont > Global_1.default.Time_wait_to_receive) {
                        if (intervalempty != null) {
                            intervalempty = null;
                            clearInterval(intervalempty);
                            cb(Global_1.default.result.ERROR_RECEIVE_PRODUCT);
                        }
                    }
                    cont++;
                }, 100);
            }, 2000);
        };
        _this.Sale_column = function (location_, cb) {
            try {
                // this.wait_for_dispensing();
                var location_1 = Array.from(location_);
                var locations = location_1.slice(1);
                var pin_1 = location_1.slice(0, 1);
                async_1.default.mapSeries(locations, function (Columna, cb1) {
                    var Loc = pin_1 + Columna;
                    _this.Out1.HIGH(Loc.toString(), function (err) {
                        Global_1.default.logger.write('activa' + _this.Is_Location);
                        cb1(err);
                    });
                }, function (err) {
                    cb(err);
                    _this.Principal.state_Machine = Global_1.default.State_Machine.Dispensing_product;
                });
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Global_1.default.logger.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Sale_column_low = function (location_, cb) {
            var location = Array.from(location_);
            var locations = location.slice(1);
            var pin = location.slice(0, 1);
            async_1.default.mapSeries(locations, function (Columna, cb1) {
                var Loc = pin + Columna;
                _this.Out1.LOW(Loc.toString(), function (err) {
                    Global_1.default.logger.write('desactiva' + _this.Is_Location);
                    cb1(err);
                });
            }, function (err) {
                cb(err);
            });
        };
        _this.Sale_steps = function (pin, location, cb) {
            // this.init_location;
            _this.Is_pin = pin;
            _this.Is_Location = location;
            Global_1.default.logger.write('sales steps' + _this.Is_pin);
            async_1.default.series([
                async_1.default.apply(_this.Input.initial_elevator_call, null),
                async_1.default.apply(_this.Ubicacion, '1'),
                async_1.default.apply(_this.GotoLevel, _this.Is_pin),
                async_1.default.apply(_this.Sale_U, location),
                async_1.default.apply(_this.init_product, null),
                async_1.default.apply(_this.empty, null)
            ], function (err, result) {
                if (err === null) {
                    Global_1.default.logger.debug('proceso de venta completo');
                    cb(null, result);
                }
                else {
                    if (err.value == 6) {
                        cb(null);
                        Global_1.default.logger.error('Se dispenso pero no se recogio el producto ' + JSON.stringify(err));
                    }
                    else {
                        Global_1.default.logger.fatal('no se completo el proceso ' + JSON.stringify(err));
                        cb(err);
                    }
                }
            });
        };
        _this.preparing_to_dispense = function (cb) {
            var time = Global_1.default.Time_down_to_dispensing_small;
            if (Global_1.default.Product_is == 2) {
                time = Global_1.default.Time_down_to_dispensing_big;
            }
            else {
                time = Global_1.default.Time_down_to_dispensing_small;
            }
            _this.Out1.motorDown(function (err) {
                if (err == null) {
                    Global_1.default.logger.write('Elevador hacia abajo ' + err);
                    setTimeout(function () {
                        _this.Out1.motoroff(function (err) {
                            if (err == null) {
                                Global_1.default.logger.write('Elevador apagado y en posición de venta' + err);
                                cb(null);
                            }
                            else {
                                Global_1.default.logger.error(Global_1.default.result.ERROR_DISPENSING_LEVEL.text);
                                cb(Global_1.default.result.ERROR_DISPENSING_LEVEL);
                            }
                        });
                    }, time);
                }
                else {
                    Global_1.default.logger.error(Global_1.default.result.ERROR_DISPENSING_LEVEL.text);
                    cb(Global_1.default.result.ERROR_DISPENSING_LEVEL);
                }
            });
        };
        ///Funcion que ubica elevador en la puerta inferior
        _this.preparing_to_receive = function (cb) {
            _this.Out1.motorDown(function (err) {
                if (err == null) {
                    Global_1.default.logger.write('Elevador hacia abajo ' + err);
                    setTimeout(function () {
                        _this.Out1.motoroff(function (err) {
                            if (err == null) {
                                Global_1.default.logger.write('Elevador apagado y en posición de recibir' + err);
                                cb(null);
                            }
                            else {
                                Global_1.default.logger.error('No fu posible detener el motor luego de preaparar para para recibir');
                                cb('No fu posible detener el motor luego de preaparar para recibir');
                            }
                        });
                    }, 250);
                }
                else {
                    Global_1.default.logger.error('No fu posible detener el motor luego de preaparar para entregar');
                }
            });
        };
        _this.Go_level = function (pin, cb) {
            try {
                var intervalGoLevel_1 = setInterval(function () {
                    if (_this.Principal.state_Machine == Global_1.default.State_Machine.Init_location) {
                        if (intervalGoLevel_1 != null) {
                            intervalGoLevel_1 = null;
                            clearInterval(intervalGoLevel_1);
                            _this.Out1.motorUP(function (err) {
                                _this.wait_for_up_select();
                                //this.wait_for_up_select_down();
                                _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_level;
                                Global_1.default.logger.write('motor avanza arriba' + err);
                                cb(err);
                            });
                        }
                    }
                    else if (_this.Principal.state_Machine == Global_1.default.State_Machine.atasco) {
                        if (intervalGoLevel_1 != null) {
                            intervalGoLevel_1 = null;
                            clearInterval(intervalGoLevel_1);
                        }
                    }
                }, 100);
            }
            catch (e) {
                Global_1.default.logger.error(e.stack);
            }
        };
        _this.GotoLevel = function (data, cb) {
            try {
                var pin = Array.from(data);
                if (pin.length > 2) {
                    cb('dato incorrecto');
                }
                else {
                    switch (pin[0]) {
                        case 'a':
                        case 'A':
                            _this.Go_level('A', function (err) {
                                cb(err, 'Piso A');
                            });
                            break;
                        case 'b':
                        case 'B':
                            _this.Go_level('B', function (err) {
                                cb(err, 'Piso B');
                            });
                            break;
                        case 'c':
                        case 'C':
                            _this.Go_level('C', function (err) {
                                cb(err, 'Piso C');
                            });
                            break;
                        case 'd':
                        case 'D':
                            _this.Go_level('D', function (err) {
                                cb(err, 'Piso D');
                            });
                            break;
                        case 'e':
                        case 'E':
                            _this.Go_level('E', function (err) {
                                cb(err, 'Piso E');
                            });
                            break;
                        case 'f':
                        case 'F':
                            _this.Go_level('F', function (err) {
                                cb(err, 'Piso F');
                            });
                            break;
                        default:
                            cb('dato incorrecto');
                            break;
                    }
                }
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + 'Error al venta');
                cb(e.stack);
            }
        };
        _this.Ubicacion = function (data, cb) {
            try {
                _this.wait_for_up_select_down();
                if (_this.Principal.Is_init_location === false) {
                    switch (data) {
                        case '2':
                            Global_1.default.number_atasco = 0;
                            _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_finish_location;
                            _this.Out1.motorDown(function (err) {
                                Global_1.default.logger.write('motor bajando afinalizar compra' + err);
                                cb(err);
                            });
                            break;
                        case '1':
                            Global_1.default.number_atasco = 0;
                            _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_Init_location;
                            _this.Out1.motorDown(function (err) {
                                Global_1.default.logger.write('motor bajando a pocision inicial' + err);
                                cb(err);
                            });
                            break;
                        case '3':
                            Global_1.default.number_atasco = 0;
                            _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_Init_location_ERROR;
                            _this.Out1.motorDown(function (err) {
                                Global_1.default.logger.error('motor bajando a pocision inicial al no encotrar productos en la banda' + err);
                                cb(err);
                            });
                            _this.Is_sale_error = true;
                            break;
                        case '4':
                            Global_1.default.number_atasco = 0;
                            _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_Init_location_ERROR;
                            _this.Out1.motorDown(function (err) {
                                Global_1.default.logger.error('motor bajando a pocision inicial al ser detenido por el sensor 1' + err);
                                cb(err);
                            });
                            _this.Is_sale_error = true;
                            break;
                        case '5':
                            _this.Principal.state_Machine = Global_1.default.State_Machine.Go_to_Init_location_ERROR;
                            _this.Out1.motorDown(function (err) {
                                Global_1.default.logger.error('motor bajando a pocision inicial por atasco' + err);
                                cb(err);
                            });
                            _this.Is_sale_error = true;
                            break;
                    }
                }
                else {
                    cb(null);
                    _this.Principal.state_Machine = Global_1.default.State_Machine.Init_location;
                    Global_1.default.logger.debug('ya esta en posicion inicial');
                }
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + 'Error ubicar elevador');
                cb(e.stack);
            }
        };
        _this.init_location = function (data, cb) {
            try {
                _this.Input.initial_elevator();
            }
            catch (e) {
                Global_1.default.result.EXCEPTION.stack = e.stack;
                Global_1.default.logger.error(JSON.stringify(Global_1.default.result.EXCEPTION));
                cb(Global_1.default.result.EXCEPTION);
            }
        };
        _this.Close = function (cb) {
            try {
                _this.Input.Close(function (err) {
                    cb(err);
                });
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + "Error detener lectura de sensores ");
                cb(e);
            }
        };
        _this.Open_ = function (cb) {
            try {
                _this.Input.Open(function () {
                    cb(null);
                });
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + "Error al activar los sensores  ");
                cb(e);
            }
        };
        _this.ProcessEnv_PIN = function (Pin) {
            try {
                Global_1.default.logger.debug('pin   ' + Pin + '  activo');
                switch (Pin) {
                    case 'P1':
                        if (_this.Is_pin === 'F' || _this.Is_pin === 'f') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoF_ON++;
                                if (_this.PisoF_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto en fila F');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion inicial ' + _this.Is_Location + err);
                                    });
                                }
                            }
                        }
                        break;
                    case 'P2':
                        if (_this.Is_pin === 'E' || _this.Is_pin === 'e') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoE_ON++;
                                if (_this.PisoE_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto en fila E');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                                    });
                                }
                            }
                        }
                        break;
                    case 'P3':
                        if (_this.Is_pin === 'D' || _this.Is_pin === 'd') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoD_ON++;
                                if (_this.PisoD_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion ' + err);
                                    });
                                }
                            }
                        }
                        break;
                    case 'P4':
                        if (_this.Is_pin === 'C' || _this.Is_pin === 'c') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoC_ON++;
                                if (_this.PisoC_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto para fila C');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion ' + err);
                                    });
                                }
                            }
                        }
                        break;
                    case 'P5':
                        if (_this.Is_pin === 'B' || _this.Is_pin === 'b') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoB_ON++;
                                if (_this.PisoB_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto en fila B');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                                    });
                                }
                            }
                        }
                        break;
                    case 'P6':
                        if (_this.Is_pin === 'A' || _this.Is_pin === 'a') {
                            if (_this.Principal.state_Machine == Global_1.default.State_Machine.Dispensing_product) {
                                _this.PisoA_ON++;
                                if (_this.PisoA_ON > Global_1.default.Product_long) {
                                    Global_1.default.logger.error('demasiadas vueltas para producto en fila A');
                                    _this.Sale_column_low(_this.Is_Location, function (err) {
                                        Global_1.default.logger.write('Apagaaa' + _this.Is_Location + err);
                                    });
                                    _this.Ubicacion('3', function (err) {
                                        Global_1.default.logger.error('Enviando a ubicacion ' + _this.Is_Location + err);
                                    });
                                }
                            }
                        }
                        break;
                }
                // }
            }
            catch (e) {
                Global_1.default.logger.error(e.stack + 'Error al procesar evento');
            }
        };
        Global_1.default.logger = _principal.log;
        var input = new Input_1.Input(_principal);
        input.Open();
        _this.Input = input;
        input.on('Sensor On', _this.ProcessEnv);
        input.on('Input On', _this.ProcessEnv_PIN);
        _this.Principal = _principal;
        input.on("elevator On", function (state) {
            if (state === 'Up') {
                out1.motorUP(function (err) {
                    Global_1.default.logger.warning("motor arriba" + err);
                });
            }
            else if (state === 'Down') {
                out1.motorDown(function (err) {
                    Global_1.default.logger.warning("motor abajo" + err);
                });
            }
        });
        input.on("Stop", function (state) {
            Global_1.default.logger.fatal('stooooooooooopppppjjjadnkafkjfakhagdjbkgakzbnzgfkbjsgjkeskjaekjgskjbsghllbkgf' +
                'haetlkhsdgnlkhgsnklsflngslsg' +
                'ikhgksgklki');
        });
        input.on("elevator Off", function (state) {
            if (state === 'Up' || state === 'Down') {
                out1.motoroff(function (err) {
                    Global_1.default.logger.fatal("motor apagado" + err);
                });
            }
        });
        input.on("Stop", function (state) {
            if (state === 'on') {
            }
        });
        input.on("Sensor Off", function (pin) {
            if (pin === 'SM') {
                _this.Principal.Is_init_location = false;
            }
        });
        return _this;
    }
    return Shop;
}(events_1.default.EventEmitter));
exports.Shop = Shop;
