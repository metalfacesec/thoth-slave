'use strict';

const io = require('socket.io-client');
const PortScanUtils = require('./utils/PortScanUtils');
 
const socket = io('http://localhost:3000');
const TARGETS_TO_PULL = 5;

let unchecked_targets = [];

socket.on('connect', () => {
    socket.emit('get_target', TARGETS_TO_PULL);
});

socket.on('target_data', targets => {
    unchecked_targets = unchecked_targets.concat(targets);
});

function checkTarget() {
    if (!unchecked_targets.length) return socket.emit('get_target', TARGETS_TO_PULL);

    let current_target = unchecked_targets.pop();
    PortScanUtils.runPortScan(current_target, socket);
}

setInterval(checkTarget, 1000);