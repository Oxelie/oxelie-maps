var bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    log4js = require('log4js');

module.exports = function(app) {

  var config = require('./config');

  // Set up view engine.
  app.set('views', config.path('client'));
  app.set('view engine', 'jade');

  // Serve favicon.
  app.use(favicon(config.path('public', 'favicon.ico')));

  // Override log method to silence asset logs (if enabled).
  var loggerOptions = {};
  if (config.silenceAssetLogs) {
    loggerOptions.filter = function(level, message) {
      return !message.match(/GET \/assets\//);
    };
  }

  // Log http requests at the TRACE level.
  var logger = require('./logger')('express', loggerOptions);
  app.use(log4js.connectLogger(logger, {
    level: log4js.levels.TRACE,
    format: ':remote-addr :method :url HTTP/:http-version :status - :response-time ms'
  }));

  // Automatically parse request body.
  app.use(bodyParser.json());
};
