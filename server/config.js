var _ = require('underscore'),
    fs = require('fs'),
    inflect = require('inflect-js'),
    path = require('path'),
    pkg = require('../package.json'),
    yaml = require('js-yaml');

// TODO: add log level to configuration
var properties = [ 'host', 'port', 'protocol', 'silenceAssetLogs' ];

var config = module.exports = {
  version: pkg.version,
  env: process.env.NODE_ENV || 'development',
  root: path.resolve(path.join(__dirname, '..')),

  /**
   * Returns a path relative to the application's root directory.
   *
   *   config.path('server', 'app.js');   // => "/path/to/gdx/server/app.js"
   */
  path: function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(config.root);
    return path.join.apply(path, args);
  },

  /**
   * Returns a copy of the configuration object without utility functions.
   */
  values: function() {
    return _.omit(config, 'path');
  }
};

// Get configuration from environment variables.
var envConfig = _.reduce(properties, function(memo, value) {

  var key = value,
      envVar = 'GDX_' + inflect.underscore(key).toUpperCase();

  if (process.env[envVar]) {
    memo[key] = process.env[envVar];
  }

  return memo;
}, {});

_.defaults(config, envConfig);

// Load the optional YAML configuration file at "config/$NODE_ENV.yml" (defaults to config/development.yml).
var configFile = path.join(config.root, 'config', config.env + '.yml');

if (fs.existsSync(configFile)) {

  var rawContents = fs.readFileSync(configFile, { encoding: 'utf-8' }),
      parsedContents = yaml.safeLoad(rawContents, { filename: configFile });

  _.defaults(config, _.pick.apply(_, [ parsedContents ].concat(properties)));
}

// Set defaults if needed.
_.defaults(config, {
  host: 'localhost',
  port: 3000,
  protocol: 'http',
  silenceAssetLogs: true,
});

function isInteger(n) {
  return n === +n && n === (n|0);
}

// Parse integers.
_.each([], function(property) {
  if (_.isString(config[property])) {
    config[property] = parseInt(config[property], 10);
  }
});

// Parse booleans.
_.each([ 'silenceAssetLogs' ], function(property) {
  if (_.isString(config[property])) {
    config[property] = !!config[property].match(/^(?:1|y|yes|t|true)$/);
  }
});
