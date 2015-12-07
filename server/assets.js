var _ = require('underscore'),
    express = require('express'),
    logger = require('./logger')('assets'),
    path = require('path');

module.exports = function(app) {

  var config = require('./config');

  if (config.env == 'development') {

    // in development, live-compile assets with the asset pipeline
    var mincer = require('mincer'),
        mincerEnvironment = require(config.path('mincer', 'environment'));

    app.use('/assets', mincer.createServer(mincerEnvironment));

    var templateHelpers = require(config.path('mincer', 'helpers', 'templates'));
    _.extend(app.locals, templateHelpers(config.env));

    logger.debug('Assets will be compiled live through mincer (configuration in mincer/environment.js)');
  } else {

    // in production, use pre-compiled assets
    app.use(express.static(config.path('public')));

    logger.debug('Assets have been precompiled (configuration in mincer/environment.js) and will be served statically from the "public" directory');
  }
};
