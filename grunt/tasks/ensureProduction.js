// Please see the Grunt documentation for more information regarding task
// creation: http://gruntjs.com/creating-tasks
module.exports = function(grunt) {
  grunt.registerTask('ensureProduction', 'Ensure that the NODE_ENV environment variable is set to "production":', function() {
    if (process.env.NODE_ENV != 'production') {
      grunt.fail.warn('$NODE_ENV must be set to "production".');
    }
  });
};
