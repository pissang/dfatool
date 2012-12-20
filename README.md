**dfatool.js** is a data flow analyze tool for javascript code runs on node.js. 

The code analyze is based on [Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) AST, which you can generated with [Esprima](esprima.org). And [Escodegen](https://github.com/Constellation/escodegen) is needed for the final output code regenerate.

### Install

	npm install dfatool

### Usage

Use [Esprima](esprima.org) to generate AST
	
	var ast = esprima.parse(data, {
		loc : true
	});

Build scope for the program

	var globalScope = dfatool.globalScope
	dfatool.buildScope(ast, globalScope);


anaylyze the code
	
	globalScope.initialize();
	globalScope.derivation();

Get the variable defined in a specific scope
		
	var variable = scope.getDefine("variableName");

Inference the variable's value in a specific position of program
	
	var loc = {
		line : 20,
		column : 20
	};
	var value = variable.inference( scope.offsetLoc(loc) );

Inference the type(`object`,`function`,`array`,`literal`,`expression`)
	
	var type = value.type

Read property of the value( support prototype chain look up)

	var property = value.access("propName.propName");

If the value is an array
	
	var elem = value.access(10);

If the value is an function, you can simulate an function call

	var returnedVariable = value.execute(callExprAST, scope);