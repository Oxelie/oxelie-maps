var fs = require('fs'),
    http = require('http'),
    p = require('bluebird');

p.promisifyAll(fs);
p.promisifyAll(http.Server.prototype);
