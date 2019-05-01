const SshProtocol = require('../protocol/SshProtocol');
const HttpProtocol = require('../protocol/HttpProtocol');

class ProtocolFactory {
    static async fuzzProtocol(results, port) {
        let protocol_data = {
            port: null,
            protocol: null,
            raw_response: null,
            version: null
        };
        let result = null;
        switch (port) {
            case 22:
                await SshProtocol.check(port, results);
                break;
            case 80:
                await HttpProtocol.check(port, results);
                break;
        }
        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }
}

module.exports = ProtocolFactory;