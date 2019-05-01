const net = require('net');
const LogUtils = require('./LogUtils');
const ProtocolFactory = require('../protocol/ProtocolFactory');

const Socket = net.Socket;

class PortScanUtils {
    static async runPortScan(target, socket) {
        try {
            let results = {
                ip: target.ip,
                is_random: target.is_random,
                open: [],
                closed: [],
                protocol_info: []
            }
            //let initial_ports = [ 21, 22, 80 ];
            //let extended_ports = [ 20, 23, 25, 43, 53, 67, 68, 79, 110, 123, 201, 389, 514, 554, 546, 547, 587, 691, 3306, 3690, 5900, 8080 ];
            let initial_ports = [ 22, 80 ]; 
            let extended_ports = [];

            for (let i = 0; i < initial_ports.length; i++) {
                results = await this.checkPort(target.ip, initial_ports[i], results);
            }
            
            if (!results.open.length) {
                return;
            }
            
            for (let i = 0; i < extended_ports.length; i++) {
                results = await this.checkPort(target.ip, extended_ports[i], results);
            }

            for (let i = 0; i < results.open.length; i++) {
                results = await ProtocolFactory.fuzzProtocol(results, results.open[i]);
            }

            LogUtils.logInfo('Found the following ports open ' + results.open.join(',') + ' on ' + target.ip);
            socket.emit('live_target_found', results);
        } catch (error) {
            console.log(error);
        }
    }

    static async checkPort(ip, port, results) {
        let open = await this.checkPortOpen(ip, port, 800);
        return new Promise((resolve, reject) => {
            resolve(this.processPortResponse(results, open, port));
        });
    }

    static processPortResponse(results, response, port) {
        if (response) {
            results.open.push(port);
        } else {
            results.closed.push(port);
        }
        return results;
    }

    static checkPortOpen(ip, port, timeout) {
        LogUtils.logInfo('Checking port ' + port + ' on ip ' + ip);
        return new Promise((resolve, reject) => {
            var socket = new Socket();
            socket.setTimeout(timeout);

            socket.on('connect', function () {
                LogUtils.logInfo('Port ' + port + ' connected! Calling destory on port');
                socket.destroy();
                resolve(true);
            });
            socket.on('timeout', function () {
                LogUtils.logInfo('Port ' + port + ' timed out! Calling destory on port');
                socket.destroy();
            });
            socket.on('error', function (exception) {
                LogUtils.logError('Port ' + port + ' got an error! Calling destory on port. ' + exception);
                socket.destroy();
            }); 
            socket.on('close', function (exception) {
                LogUtils.logInfo('Port ' + port + ' closed!');
                return resolve(false);
            });

            LogUtils.logInfo('Attempting connection to Port ' + port);
            socket.connect(port, ip);
        });
    }
}

module.exports = PortScanUtils;