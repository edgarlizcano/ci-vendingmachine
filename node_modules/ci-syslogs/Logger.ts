import syslog from "syslog-client";

export class Logger {
    private facility: any;
    private client: syslog;
    public static Facilities = {
        Billetero: 17, //Local1
        Billing: 18, //Local2
        Logic: 19, //Local3
        Machine: 20, //Local4
        Monedero: 21, //Local5
        Liquidation: 22, //Local6
        Other: 23 //Local7
    };

    constructor(ip: string, facility: any) {
        this.facility = facility;
        let createOptions = {
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
    public LogDebug (message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Debug
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Debug: "+message);
            }
        })
    }
    public LogInfo(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Informational
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Info: "+message);
            }
        })
    }
    LogNotice(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Notice
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Notice: "+message);
            }
        })
    }
    public LogWarning(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Warning
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Warning: "+message);
            }
        })
    }
    public LogError(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Error
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Error: "+message);
            }
        })
    }
     public LogCritical(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Critical
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Critical: "+message);
            }
        })
    }
    public LogAlert(message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Alert
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Alert: "+message);
            }
        })
    }
    public LogEmergency (message):void{
        let logOptions = {
            facility: this.facility,
            severity: syslog.Severity.Emergency
        };
        this.client.log(message, logOptions, function(error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Syslog-Emergency: "+message);
            }
        })
    }
}
