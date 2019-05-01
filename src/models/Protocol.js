class Protocol {
    constructor(port, protocol, raw_response, version, server_type) {
        this.port = port;
        this.protocol = protocol;
        this.raw_response = raw_response;
        this.version = version;
        this.server_type = server_type;
    }
}

module.exports = Protocol;