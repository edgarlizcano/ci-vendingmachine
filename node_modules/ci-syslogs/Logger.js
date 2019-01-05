"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var syslog = require("syslog-client");
var Logger = /** @class */ (function () {
    function Logger(ip, facility) {
        var _this = this;
        this.options = {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        this.WriteLog = function (message, severity) {
            var date = new Date();
            var msg = date.toLocaleDateString("es-CO", _this.options) + " - " + message;
            var logOptions = {
                facility: _this.facility,
                severity: severity
            };
            _this.client.log(msg, logOptions, function (error) {
                if (error) {
                    console.error(error);
                }
                else {
                    console.log("Syslog-" + severity + ": " + msg);
                }
            });
        };
        this.facility = facility;
        var createOptions = {
            transport: syslog.Transport.Udp,
            port: 514
        };
        this.client = syslog.createClient(ip, createOptions);
        this.client.on("error", function (error) {
            console.error(error);
            this.client.close();
        });
        this.client.on("close", function () {
            console.log("connection closed");
        });
    }
    Logger.Facilities = {
        Billetero: 17,
        Billing: 18,
        Logic: 19,
        Machine: 20,
        Monedero: 21,
        Liquidation: 22,
        Other: 23 //Local7
    };
    Logger.Severities = {
        Emergency: 0,
        Alert: 1,
        Critical: 2,
        Error: 3,
        Warning: 4,
        Notice: 5,
        Informational: 6,
        Debug: 7
    };
    return Logger;
}());
exports.Logger = Logger;