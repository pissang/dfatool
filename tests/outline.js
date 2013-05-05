var esprima = require('esprima');
var dfatool = require('../dfatool');
var fs = require('fs');
var util = require('util');	
var codegen = require('escodegen');

var argv = process.argv.slice(2);
var fileName = argv[0];

if( ! fileName){
	console.error("Input scripts needed, 'node outline.js cases/array.js'");
	return;
}
fs.readFile(fileName, 'utf-8', function(err, data){

	var ast = esprima.parse(data, {
		loc : true
	});
	var globalScope = dfatool.newGlobalScope();
	dfatool.buildScope(ast, globalScope);

	globalScope.initialize();
	globalScope.derivation()

	var outline = {};
	for(var name in globalScope._defines){
		var variable = globalScope._defines[name];
		var value = variable.inference();
		if( value ){
			outline[variable.name] = value.toJSON();
		}
	}

	console.log(util.inspect(outline, false, null));

	dfatool.flushlog("log.txt");
})