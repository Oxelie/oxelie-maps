  module.exports = function(grunt) {

  var environment = process.env.NODE_ENV || 'development';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    bump: {
      options: {
        files: [ 'bower.json', 'package.json' ],
        commit: false,
        createTag: false,
        push: false
      }
    },

    clean: {
      cache: [ 'cache/**/*' ],
      public: [ 'public/**/*', '!public/favicon.ico' ]
    },

    copy: {
      assets: {
        files: [
          // javascripts
          { nonull: true, src: 'bower_components/underscore/underscore.js', dest: 'vendor/assets/javascripts/underscore.js' },
          { nonull: true, src: 'bower_components/jquery/dist/jquery.js', dest: 'vendor/assets/javascripts/jquery.js' },
          { nonull: true, src: 'bower_components/moment/moment.js', dest: 'vendor/assets/javascripts/moment.js' },
          { nonull: true, src: 'bower_components/moment/locale/fr.js', dest: 'vendor/assets/javascripts/moment-fr.js' },
          { nonull: true, src: 'bower_components/angular/angular.js', dest: 'vendor/assets/javascripts/angular.js' },
          { nonull: true, src: 'bower_components/a0-angular-storage/dist/angular-storage.js', dest: 'vendor/assets/javascripts/angular-storage.js' },
          { nonull: true, src: 'bower_components/angular-ui-router/release/angular-ui-router.js', dest: 'vendor/assets/javascripts/angular-ui-router.js' },
          { nonull: true, src: 'bower_components/angular-translate/angular-translate.js', dest: 'vendor/assets/javascripts/angular-translate.js' },
          { nonull: true, src: 'bower_components/angular-sanitize/angular-sanitize.js', dest: 'vendor/assets/javascripts/angular-sanitize.js' },
          { nonull: true, src: 'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js', dest: 'vendor/assets/javascripts/angular-translate-loader-static-files.js' },
          { nonull: true, src: 'bower_components/angular-bootstrap-material/angular-bootstrap-material.js', dest: 'vendor/assets/javascripts/angular-bootstrap-material.js' },
          { nonull: true, src: 'bower_components/angular-strap/dist/angular-strap.js', dest: 'vendor/assets/javascripts/angular-strap.js' },
          { nonull: true, src: 'bower_components/angular-strap/dist/angular-strap.tpl.js', dest: 'vendor/assets/javascripts/angular-strap-tpl.js' },
          { nonull: true, src: 'bower_components/angular-moment/angular-moment.js', dest: 'vendor/assets/javascripts/angular-moment.js' },
          { nonull: true, src: 'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js', dest: 'vendor/assets/javascripts/angular-leaflet-directive.js' },
          { nonull: true, src: 'bower_components/bootstrap/dist/js/bootstrap.js', dest: 'vendor/assets/javascripts/bootstrap.js' },
          { nonull: true, src: 'bower_components/bootstrap-material-design/scripts/material.js', dest: 'vendor/assets/javascripts/bootstrap-material-design-material.js' },
          { nonull: true, src: 'bower_components/bootstrap-material-design/scripts/ripples.js', dest: 'vendor/assets/javascripts/bootstrap-material-design-ripples.js' },
          { nonull: true, src: 'bower_components/leaflet/dist/leaflet-src.js', dest: 'vendor/assets/javascripts/leaflet.js' },
          { nonull: true, src: 'bower_components/leaflet.draw/dist/leaflet.draw.js', dest: 'vendor/assets/javascripts/leaflet.draw.js' },
          { nonull: true, src: 'bower_components/leaflet-measure/dist/leaflet-measure.js', dest: 'vendor/assets/javascripts/leaflet-measure.js' },
          // stylesheets (if the stylesheet has relative URLs, use "assetsWithRelativeUrls" below)
          { nonull: true, cwd: 'bower_components/bootstrap/less', src: '**/*.less', dest: 'vendor/assets/stylesheets/bootstrap', expand: true },
          { nonull: true, cwd: 'bower_components/bootstrap-material-design/less', src: '**/*.less', dest: 'vendor/assets/stylesheets/bootstrap-material-design', expand: true },
          { nonull: true, src: 'bower_components/leaflet/dist/leaflet.css', dest: 'vendor/assets/stylesheets/leaflet.css' },
          { nonull: true, src: 'bower_components/angular-motion/dist/angular-motion.css', dest: 'vendor/assets/stylesheets/angular-motion.css' },
          // fonts
          { nonull: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: '**', dest: 'vendor/assets/fonts/', flatten: true, expand: true },
          { nonull: true, cwd: 'bower_components/bootstrap-material-design/fonts/', src: '**', dest: 'vendor/assets/fonts/', flatten: true, expand: true },
          { nonull: true, cwd: 'bower_components/mdi/fonts/', src: '**', dest: 'vendor/assets/fonts/', flatten: true, expand: true },
          //images
          { nonull: true, cwd: 'bower_components/leaflet/dist/images', src: '**/*.png', dest: 'vendor/assets/images/', expand: true },
          { nonull: true, cwd: 'bower_components/leaflet.draw/dist/images', src: '**/*.png', dest: 'vendor/assets/images/', expand: true },
          { nonull: true, cwd: 'bower_components/leaflet-measure/dist/images', src: '**/*.png', dest: 'vendor/assets/images/', expand: true },
        ]
      },

      // stylesheets with relative URLs (that need to be fixed to work with the asset pipeline)
      assetsWithRelativeUrls: {
        files: [
          { nonull: true, src: 'bower_components/mdi/css/materialdesignicons.css', dest: 'vendor/assets/stylesheets/materialdesignicons.css' },
          { nonull: true, src: 'bower_components/leaflet.draw/dist/leaflet.draw.css', dest: 'vendor/assets/stylesheets/leaflet.draw.css' },
          { nonull: true, src: 'bower_components/leaflet-measure/dist/leaflet-measure.css', dest: 'vendor/assets/stylesheets/leaflet-measure.css' }
        ],
        options: {
          process: require('./grunt/lib/cssAssetPipelinePreprocessor')()
        }
      }
    },

    ensureProduction: {},

    jade: {
      precompile: {
        options: {
          data: function() {
            return require('./mincer/helpers/templates')(environment);
          }
        },
        files: [
          {
            expand: true,
            src: [ '**/*.jade', '!error.jade' ],
            dest: 'public/',
            cwd: 'client',
            ext: '.html'
          }
        ]
      }
    },

    jshint: {
      all: [ 'Gruntfile.js', 'client/**/*.js', 'grunt/**/*.js', 'mincer/**/*.js', 'server/**/*.js' ]
    },

    precompileAssets: {},

    precompileYamlFiles: {},

    run: {
      deploy: {
        exec: 'node server/app.js'
      },
      develop: {
        exec: 'nodemon server/app.js'
      }
    }
  });

  grunt.loadTasks('grunt/tasks');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', [ 'jshint' ]);
  grunt.registerTask('deploy', [ 'precompile', 'run:deploy' ]);
  grunt.registerTask('develop', [ 'clean:cache', 'run:develop' ]);
  grunt.registerTask('precompile', [ 'ensureProduction', 'clean:public', 'clean:cache', 'precompileYamlFiles', 'jade:precompile', 'precompileAssets' ]);
  grunt.registerTask('vendor', [ 'copy:assets', 'copy:assetsWithRelativeUrls' ]);
};
