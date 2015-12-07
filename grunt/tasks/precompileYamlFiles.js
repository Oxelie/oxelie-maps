var _ = require('underscore'),
    fs = require('fs-extra'),
    glob = require('glob'),
    path = require('path'),
    yaml = require('js-yaml');

// Please see the Grunt documentation for more information regarding task
// creation: http://gruntjs.com/creating-tasks
module.exports = function(grunt) {

  var root = path.join(__dirname, '..', '..'),
      src = path.join(root, 'client'),
      dest = path.join(root, 'public');

  grunt.registerTask('precompileYamlFiles', 'Compile YAML files from the "clients" directory into the "public" directory', function() {

    var files = glob.sync('**/*.yml', { cwd: src });
    _.each(files, function(file) {

      var srcFile = path.join(src, file),
          destFilename = file.replace(/\.yml$/, '.json'),
          destFile = path.join(dest, destFilename),
          contents = fs.readFileSync(srcFile, { encoding: 'utf-8' }),
          data = yaml.safeLoad(contents);

      fs.mkdirsSync(path.dirname(destFile));
      fs.writeFileSync(destFile, JSON.stringify(data));

      grunt.log.ok(path.join('client', file) + ' -> ' + path.join('public', destFilename));
    });
  });
};
