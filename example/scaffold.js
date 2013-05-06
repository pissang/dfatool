#!/usr/bin/env node

var fs = require("fs");

// CONFIG 
var MODULE_PATH = "static/modules/";

// available operations
var ops = {};
ops["create"] = function(){
	var mName = params["m"],
		mPath = MODULE_PATH+mName + "/";
	if( ! mName ){
		console.log('Create operation need "m" param as module name');
		return;
	}
	// check if the module exist already
	if( fs.existsSync( mPath ) ){
		console.log("Module "+mName+" already existed");
		return;
	}
	// create module folder;
	fs.mkdirSync( mPath );
	
	var code = fs.readFileSync("template_module", "UTF-8");
	code = code.replace(/{{moduleName}}/g, mName);
	// create module portal javascript file
	fs.writeFileSync(mPath+"index.js", code, "utf-8");
	// create empty template file
	fs.writeFileSync(mPath+mName+".html", "<!--"+mName+"-->", "utf-8");
	// create empty less file
	fs.writeFileSync(mPath+mName+".less", "/*"+mName+"*/", "utf-8");

	console.log("Module "+mName+" created");
}

ops["list"] = function(){
}

// utils
function parseArgv( argv ){
	var params = {};
	params["op"] = argv[2];
	argv.slice(3).forEach( function( val, idx){
		var arg = val.split("=");
		params[ trim(arg[0]) ] = trim(arg[1] || "");
	} )
	return params;
}

function trim(str){
	return str.replace(/^\s+|\s+$/g, '');
}

///////////////////////////////////////
var params = parseArgv( process.argv );
var opName = params["op"];

if( ! ops[opName] ){
	console.log("Unkown operation");
	return;
}

ops[opName]();