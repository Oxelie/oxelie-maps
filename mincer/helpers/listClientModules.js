var _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

var clientsRoot = path.join(__dirname, '..', '..', 'client');

module.exports = function(clientName, baseModule) {

  var clientDir = path.join(clientsRoot, clientName);
  if (!fs.existsSync(clientDir)) {
    throw new Error('No angular client directory found at "' + clientDir + '".');
  }

  var subfolders = ['pages', 'tools'];
  var moduleNames = [];

  _.each(subfolders, function (element) {
    var modulesDir = path.join(clientDir, 'modules/'+element);
    var modules = _.filter(fs.readdirSync(modulesDir), function(file) {
      return fs.existsSync(path.join(modulesDir, file, 'index.js'));
    });

    moduleNames = moduleNames.concat(modules);
  });

  return _.map(moduleNames, function(name) {
    return baseModule + '.' + name;
  });
};
