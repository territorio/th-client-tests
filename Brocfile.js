var mergeTrees = require('broccoli-merge-trees'),
    es6Filter = require('./th-client-dev/broccoli/es6'),
    defeatureifyFilter = require('./th-client-dev/broccoli/defeatureify'),
    fs = require('fs'),
    replace = require('./th-client-dev/broccoli/replace'),
    wrapFiles = require('broccoli-wrap'),
    match = require('./th-client-dev/broccoli/match'),
    precompiler = require('./th-client-dev/broccoli/precompiler').Filter,
    createPrecompilerModule = require('./th-client-dev/broccoli/precompiler').CreatePrecompilerModule,
    selfExecuting = require('./th-client-dev/broccoli/self_executing'),
    emberTemplateCompiler = require('./th-client-dev/broccoli/ember_template_compiler'),
    append = require('./th-client-dev/broccoli/append'),
    concatFilter = require('./th-client-dev/broccoli/concat'),
    moveFile = require('broccoli-file-mover'),
    pickFiles = require('broccoli-static-compiler');



// This file creation is only done at the design process
// so live-reloading do not work
var compilerInput = 'th-client-dev/ember.js/packages_es6/ember-handlebars-compiler/lib/main.js';
var compilerOutput = 'tmp/ember-handlebars-compiler.js';
emberTemplateCompiler(compilerInput, compilerOutput);

// setup precompiler
handlebarsPath = "th-client-dev/vendor/handlebars-v1.3.0.js";
precompiler.prototype.module = createPrecompilerModule(compilerOutput, handlebarsPath);


// pickFiles
var app = match('app', 'lib/**/*.js');

var thCore = match('th-client-dev', 'th-client-core/lib/**/*.js');
var emberData = match('th-client-dev', 'data/packages/*/lib/**/*.js');

var emberResolver = match('th-client-dev', 'ember-jj-abrams-resolver/packages/*/lib/core.js');
var emberAmdLibs = match('th-client-dev', 'ember.js/packages_es6/*/lib/**/*.amd.js');
var emberLibs = match('th-client-dev', 'ember.js/packages/{rsvp,metamorph}/lib/main.js');
var emberModules = match('th-client-dev', 'ember.js/packages_es6/*/lib/**/!(*.amd).js');//https://github.com/isaacs/node-glob/issues/62
var handlebarsRuntime = match('th-client-dev', 'vendor/handlebars.runtime-v1.3.0.js');
var jquery = match('th-client-dev', 'vendor/jquery-1.9.1.js');



var emberMain = match('th-client-dev', 'shims/ember.js');
var es6Options = function(filePath) {
                    return filePath.replace('app/app', 'app')
                                   .replace('th-client-dev/th-client-core/','app/')
                                   .replace('th-client-dev/ember.js/packages/','')
                                   .replace('th-client-dev/data/packages/','')
                                   .replace('th-client-dev/ember.js/packages_es6/','')
                                   .replace('lib/','')
                                   .replace(/.js$/, '')
                                   .replace(/\/main$/, '');
                  };

var es6Options2 = function(filePath) {
                    return filePath.replace('th-client-dev/data/packages/','')
                                   .replace(/.js$/, '')
                  };




// thModules
thCore = es6Filter(thCore, es6Options);


// emberModules
                                  
emberModules = es6Filter(emberModules, es6Options);
emberData = es6Filter(emberData, es6Options2);


//var features = match('.', 'ember_features.json'); // if a tree is passed, auto-rebuild whenever the file change
var defeatureifyOptions = JSON.parse(fs.readFileSync('th-client-dev/ember_features.json', 'utf8'));

emberModules = defeatureifyFilter(emberModules, {options: defeatureifyOptions});
emberModules = precompiler(emberModules);


// handlebarsRuntime
handlebarsRuntime = append(handlebarsRuntime, {before: false, content: "\nwindow.Handlebars = Handlebars\n"});
handlebarsRuntime = selfExecuting(handlebarsRuntime);

// app
app = es6Filter(app, es6Options);


// compose and build app.js
var trees = [app, emberData, emberResolver, emberAmdLibs, emberLibs, emberMain, emberModules, handlebarsRuntime, jquery, thCore];

// ember-qunit

var emberQunit = match('th-client-dev', 'ember-qunit/lib/**/*.js');
emberQunit = es6Filter(emberQunit, { compatFix: true, 
                                     moduleGenerator: function(filePath) {
                                       return filePath.replace('th-client-dev/', '')
                                         .replace('lib/','')
                                         .replace(/.js$/, '');
                                         //.replace(/\/main$/, '');  #issue: https://github.com/rpflorence/ember-qunit/issues/42 
                                 }  
});


trees.push(emberQunit);

var testsUtils = match('app', 'tests/lib/**/*.js');
testsUtils = es6Filter(testsUtils, function(filePath) {
                                       return filePath.replace('app/tests/', '')
                                         .replace('lib/','')
                                         .replace(/.js$/, '')
                                         .replace(/\/main$/, '');  
                                   });

trees.push(testsUtils);

var emberTests = match('app', 'tests/tests/**/*_test.js');
emberTests = concatFilter(emberTests, 'tests.js');


trees = new mergeTrees(trees)
trees = concatFilter(trees, 'app.js');
trees = selfExecuting(trees);
trees = append(trees, {before: true, path: "th-client-dev/ember.js/packages/loader/lib/main.js"});


var publicFiles;


publicFiles = pickFiles('app', {
  srcDir: '/tests',
  destDir: '/' });

trees = [publicFiles, trees, emberTests];

trees = new mergeTrees(trees)
module.exports = trees;
