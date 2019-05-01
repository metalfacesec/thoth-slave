const net = require('net');

class FingerprintUtils {
    static fuzzPortWithData(ip, port, message, timeout) {
        return new Promise((resolve, reject) => {
            let client = new net.Socket();
            client.setTimeout(timeout);
        
            client.connect(port, ip, () => {
                client.write(message);
            });
        
            client.on('timeout', () => {
                client.destroy();
                return resolve(null);
            })
        
            client.on('data', (data) => {
                data = data + "";

                client.destroy();
                return resolve(data);
            });
        
            client.on('close', () => {
                return resolve(null);
            });
        
            client.on('error', (err) => {
                client.destroy();
                return resolve();
            });
        });
    }
}

module.exports = FingerprintUtils;