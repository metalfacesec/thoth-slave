const fs = require('fs');

// TODO: Move to date time utils
var dateTime = require('node-datetime');

const log_file = '/home/mfsec/repo/thoth-slave/log/thoth.log';

class LogUtils {
    static logInfo(info) {
        let logString = '[INFO]' + this.getDateTime() + '::' + info + '\n';
        this.writeLog(logString);
    }

    static logError(info) {
        let logString = '[ERROR]' + this.getDateTime() + '::' + info + '\n';
        this.writeLog(logString);
    }

    static writeLog(info) {
        fs.appendFile(log_file, info, function (err) {
            if(err) {
                return console.log(err);
            }
        }); 
    }

    static getDateTime() {
        var dt = dateTime.create();
        return dt.format('Y-m-d H:M:S');
    }
}

module.exports = LogUtils;