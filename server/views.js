var _ = require('underscore'),
    express = require('express'),
    fs = require('fs'),
    logger = require('./logger')('views'),
    p = require('bluebird'),
    path = require('path'),
    yaml = require('js-yaml');

module.exports = function(app) {

  var config = require('./config'),
      router = express.Router();

  function serveIndex() {
    var cached = fs.readFileSync(config.path('public', 'index.html'), { encoding: 'utf-8' });
    return function(req, res) {
      res.send(cached);
    };
  }

  var clients = [];

  if (config.env == 'development') {
    router.use('/', serveClient());

    logger.debug('Templates will be compiled live (configuration in server/views.js)');
  } else {
    router.get('/' + client, serveIndex(client));

    logger.debug('Templates have been precompiled (see jade:precompile task in Gruntfile.js) and will be served statically from the "public" directory');
  }

  app.use('/', router);
};

var viewRegexp = /^\/(modules(?:\/[A-Za-z0-9\-\_]+)+)\.html$/;

function serveClient() {

  var config = require('./config'),
      router = express.Router();

  router.get('/locales/:locale.json', function(req, res) {

    var locale = req.params.locale;
    if (!locale.match(/^[a-z0-9\-\_]+$/i)) {
      return sendError();
    }

    var localeFile = config.path('client', 'locales', locale + '.yml');
    localeExists().then(readLocaleFile).then(parseLocaleFile).then(sendLocaleData).catch(sendError);

    function localeExists() {
      return new p(function(resolve, reject) {
        fs.exists(localeFile, function(exists) {
          if (exists) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }

    function readLocaleFile() {
      return fs.readFileAsync(localeFile, { encoding: 'utf-8' });
    }

    function parseLocaleFile(contents) {
      return yaml.safeLoad(contents, { filename: localeFile });
    }

    function sendLocaleData(data) {
      res.send(data);
    }

    function sendError(err) {
      if (err) {
        logger.error('Could not load locale "' + locale + '"', err);
        return res.status(500).send('Could not load locale "' + locale + '".');
      }

      res.status(404).send('Locale "' + locale + '" not found.');
    }
  });

  router.get('/modules/*', function(req, res) {

    var match = viewRegexp.exec(req.path);
    if (match) {
      res.render(match[1], function(err, html) {
        if (err) {
          if (err.message.indexOf('Failed to lookup view') !== -1) {
            res.status(404).send('Template not found');
          } else {
            logger.error(err);
            res.status(500).send('An unexpected error occurred.');
          }
        }

        res.send(html);
      });
    } else {
      res.status(404).send('View not found');
    }
  });

  function renderIndex(req, res) {
    res.render('index', {});
  }

  router.get('/*', renderIndex);
  router.get('/', renderIndex);

  return router;
}
