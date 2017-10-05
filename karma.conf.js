module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'requirejs'],

    files: [
      {pattern: 'test/vendor/*.js', included: false},
      {pattern: 'lib/*.js', included: false},
      {pattern: 'test/concurrent-test.js', included: false},

      'test/test-main.js'
    ],

    // list of files to exclude
    exclude: [
        'src/main.js'
    ]
  });
};