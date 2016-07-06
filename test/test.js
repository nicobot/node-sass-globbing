// Settings
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    nodeSassGlobbing = require('../index.js'),
    //sass = require('node-sass'),
    path = require('path'),
    chai = require('chai'),
    expect = chai.expect,
    FIXTURES_DIR = path.join(__dirname, 'fixtures');

var tap = require('gulp-tap');
var should = require('should');
var fs = require('fs');

var createVinyl = function createVinyl(filename, base) {

  base = path.join(FIXTURES_DIR, base);

  var filePath = path.join(base, filename);

  return new gutil.File({
    'cwd': __dirname,
    'base': base,
    'path': filePath,
    'contents': fs.readFileSync(filePath)
  });
};

describe('simple', function() {

  it('should work with gulp-sourcemaps', function(done) {
    var inputFile = path.join(FIXTURES_DIR, '/simple_variables_scss/input.scss')
    var outputFile = path.join(FIXTURES_DIR, '/simple_variables_scss/output.css')
    
    gulp.src(inputFile, {base: 'test/fixtures'})
      .pipe(sourcemaps.init())
      .pipe(sass({importer: nodeSassGlobbing, outputStyle: 'compressed'}))
      .pipe(gulp.dest(FIXTURES_DIR))
      .pipe(tap(function(file) {
        should.exist(file.sourceMap);
        String(file.contents).should.equal(
          fs.readFileSync(outputFile, 'utf-8')
        );
        done();
      }))
      ;
  });

  it('should import globs using scss syntax', function(done) {
    
    var outputFile = path.join(FIXTURES_DIR, '/simple_scss/output.css')

    var sassFile = createVinyl('input.scss', '/simple_scss');
    var stream = sass({importer: nodeSassGlobbing, outputStyle: 'compressed'});
    stream.on('data', function(cssFile) {
      should.exist(cssFile);
      should.exist(cssFile.path);
      should.exist(cssFile.relative);
      should.exist(cssFile.contents);
      String(cssFile.contents).should.equal(
        fs.readFileSync(outputFile, 'utf8')
      );
      done();
    });

    stream.write(sassFile);

  });

  it('should import globs using indented syntax', function(done) {

    var outputFile = path.join(FIXTURES_DIR, '/simple_sass/output.css')

    var sassFile = createVinyl('input.sass', '/simple_sass');
    var stream = sass({importer: nodeSassGlobbing, outputStyle: 'compressed'});
    stream.on('data', function(cssFile) {
      should.exist(cssFile);
      should.exist(cssFile.path);
      should.exist(cssFile.relative);
      should.exist(cssFile.contents);
      String(cssFile.contents).should.equal(
        fs.readFileSync(outputFile, 'utf8')
      );
      done();
    });

    stream.write(sassFile);

  })

});
