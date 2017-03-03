var glob = require('glob'),
    path = require('path');

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

module.exports = function(opts) {

  if (opts === undefined) {
    opts = {};
  }

  opts = extend({
    sync: false,
  }, opts);

  return function(url, prev, done) {
    if(!glob.hasMagic(url)) {
      // normal url, resolve to an import of the file
      if(url.indexOf('|prev=') === 0) {
        // if there is a |prev keyword, resolve file relative to that file.. so if
        // you do @import |prev=~|foo.sass, it will resolve to ~/foo.sass
        var prev_dir = null
        var prev_re = /^\|prev=([^\|]*?)\|/
        var matches = url.match(prev_re)

        if(matches.length) {
          prev_dir = path.dirname(matches[1])
          url = url.replace(prev_re, '')
          url = path.resolve(prev_dir, url)
          done({file: url})
          return void 0;
        }
      } else {
        done({file: url})
        return void 0;
      }
    }

    // search for scss | sass files if no extension provided

    // url is a glob, like foo/*.sass, resolve to importing all matching files, so
    // if there is foo/1.sass and foo/2.sass, it will import both of those files
    var cwd = path.dirname(prev)

    var handler = function (err, files) {
      var ret = {
        contents: "\n"
      }

      // import all the matched files, passing through the current file. this is
      // because if you didn't, the path will resolve relative to foo/*.sass,
      // which will fail since that is not an actual path.
      files.forEach(function(file) {
        var ext = path.extname(file)
        var abspath = path.resolve(cwd, file)

        if(/^\.s[ac]ss$/.test(ext) && prev !== abspath) {
          // don't import self
          var prev_kwd = '|prev=' + prev + '|'
          ret.contents += '@import "' + prev_kwd + file + "\";\n"
        }
      })

      done(ret)
      return void 0;
    };

    if (!opts.sync) {
      glob(url, {cwd: cwd}, handler);

    } else {

      var files = glob.sync(url, {cwd: cwd});
      handler(null, files);
    }
    
  };

};