"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var syslog_client_1 = require("syslog-client");
var Logger = /** @class */ (function () {
    function Logger(ip, facility) {
        this.facility = facility;
        var createOptions = {
            transport: syslog_client_1.Transport.Udp,
            port: 514
        };
        this.client = syslog_client_1.createClient(ip, createOptions);
        this.client.on("error", function (error) {
            console.error(error);
            this.client.close();
        });
        this.client.on("close", function () {
            console.log("connection closed");
        });
    }
    Logger.prototype.LogDebug = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Debug
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Debug: " + message);
            }
        });
    };
    Logger.prototype.LogInfo = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Informational
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Info: " + message);
            }
        });
    };
    Logger.prototype.LogNotice = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Notice
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Notice: " + message);
            }
        });
    };
    Logger.prototype.LogWarning = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Warning
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Warning: " + message);
            }
        });
    };
    Logger.prototype.LogError = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Error
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Error: " + message);
            }
        });
    };
    Logger.prototype.LogCritical = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Critical
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Critical: " + message);
            }
        });
    };
    Logger.prototype.LogAlert = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Alert
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Alert: " + message);
            }
        });
    };
    Logger.prototype.LogEmergency = function (message) {
        var logOptions = {
            facility: this.facility,
            severity: syslog_client_1.Severity.Emergency
        };
        this.client.log(message, logOptions, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Syslog-Emergency: " + message);
            }
        });
    };
    Logger.Facilities = {
        Billetero: 17,
        Billing: 18,
        Logic: 19,
        Machine: 20,
        Monedero: 21,
        Liquidation: 22,
        Other: 23 //Local7
    };
    return Logger;
}());
exports.Logger = Logger;
