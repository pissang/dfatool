/**
 * usage node inputScript.js varName newVarName
 */

var esprima = require('esprima');
var dfatool = require('../dfatool');
var fs = require('fs');
var util = require('util'); 
var codegen = require('escodegen');

var argv = process.argv.slice(2);
var fileName = argv[0];
var varName = argv[1];
var newName = argv[2];

if( ! fileName){
    console.error("Input scripts needed, 'node outline.js cases/conditional_tree.js result'");
    return;
}
if( ! varName ){
    console.error("Variable name needed, 'node outline.js cases/conditional_tree.js result'");
}
fs.readFile(fileName, 'utf-8', function(err, data){

    var ast = esprima.parse(data, {
        loc : true
    });
    var globalScope = dfatool.newGlobalScope();
    dfatool.buildScope(ast, globalScope);

    globalScope.initialize();
    globalScope.derivation();

    var variable = globalScope.getDefine(varName);
    var conditionalTree = new dfatool.ConditionalTree( variable, globalScope );
    var ast = conditionalTree.buildAST(newName || variable.name);
    console.log("========================================");
    console.log(codegen.generate(ast));
    console.log("========================================");
    console.log(codegen.generate(dfatool.Value.getDerivedAst(ast)));

    dfatool.flushlog("log.txt");
})