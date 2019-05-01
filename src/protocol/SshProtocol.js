const Protocol = require('../models/Protocol');
const FingerprintUtils = require('../utils/FingerprintUtils');

class SshProtocol {
    static async check(port, response) {
        try {
            let server_info = await FingerprintUtils.fuzzPortWithData(response.ip, port, '\n', 1000);
            console.log('Ssh server info = ' + server_info);

            let protocol = new Protocol(port, 'ssh', server_info, null, server_info);
            response.protocol_info.push(protocol);
        } catch (err) {
            console.log(err);
        }
        
        return response;
    }
}

module.exports = SshProtocol;