var fs = require('fs'),
    http = require('http'),
    NeDB = require('nedb'),
    p = require('bluebird');

p.promisifyAll(fs);
p.promisifyAll(http.Server.prototype);
p.promisifyAll(NeDB.prototype);
