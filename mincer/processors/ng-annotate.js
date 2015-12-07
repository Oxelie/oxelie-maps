var ngAnnotate = require('ng-annotate');

module.exports = function(context, src) {
  if (src.match(/angular\.module\(('|")oxelie\.map('|"|\.|\-)/)) {
    // annotate gdx modules
    return ngAnnotate(src || '', { add: true, separator: require('os').EOL }).src;
  } else {
    // don't touch the rest
    return src;
  }
};
