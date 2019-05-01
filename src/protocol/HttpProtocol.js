const dns = require('dns');
const Protocol = require('../models/Protocol');
const FingerprintUtils = require('../utils/FingerprintUtils');

class HttpProtocol {
    static async check(port, response) {
        let fuzz_response = await FingerprintUtils.fuzzPortWithData(response.ip, port, 'HEAD / HTTP/1.1\r\n\r\n', 800);

        let server_info = null
        if (fuzz_response != null && fuzz_response.includes('Server: ')) {
            server_info = fuzz_response.split('Server: ')[1].split('\r\n')[0];
        }

        let version = null;
        if (server_info != null) {
            version = this.extractVersionFromServer(server_info);
        }

        let protocol = new Protocol(port, 'http', fuzz_response, version, server_info);
        response.protocol_info.push(protocol);

        let dns = await this.reverseDnsLookup(response.ip);
        if (dns != null) {
            response.dns = dns;
        }

        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }

    static reverseDnsLookup(ip) {
        return new Promise((resolve, reject) => {
            dns.reverse(ip, function(err, domains){
                if(err != null) {
                    return resolve(null);
                }
                resolve(domains);
            });
        });
    }

    static extractVersionFromServer(server) {
        let version = null;

        if (server.includes('/')) {
            version = server.split('/')[1].trim();
            if (version.includes(' ')) {
                version = version.split(' ')[0];
            }
        }
        console.log('Version of http server = ' + version);
        return version;
    }
}

module.exports = HttpProtocol;