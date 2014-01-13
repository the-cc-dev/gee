var Path = require('path');
var Promise = require('bluebird');
var coffee = require('gulp-coffee');
var dest = require('gulp').dest;
var uglify = require('gulp-uglify');
var $ = require('gee-shell');

exports.project = function(gee) {
  var argv = gee.argv;
  var tap = gee.tap;

  function addHeader() {
    return tap(function(file) {
      var header = '/*** YOUR HEADER */';
      file.contents = Buffer.concat([new Buffer(header), file.contents]);
    });
  };

  function ifCoffee() {
    return tap(function(file, t) {
      if (Path.extname(file.path) === '.coffee')
        return t.through(coffee, []);
    });
  };

  return {
    'default': 'clean async asyncPromise scripts',

    clean: function() {
      $.rm('-rf', 'build');
    },

    'clean@release': function() {
      $.rm('-rf', 'dist');
    },

    scripts: {
      src: 'src/**/*.{coffee,js}',
      pipeline: function() {
        return [ifCoffee(), dest('build')];
      },
      release: function() {
        return [ifCoffee(), uglify(), addHeader(), dest('dist')];
      }
    },

    helloArguments: function() {
      console.log('Hello ' + argv.message);
    },

    async: function(next) {
      process.nextTick(function() {
        console.log('async');
        next();
      });
    },

    asyncPromise: function() {
      var vow = Promise.pending();
      process.nextTick(function() {
        console.log('promise');
        vow.fulfill();
      });
      return vow.promise;
    }
  };
};
