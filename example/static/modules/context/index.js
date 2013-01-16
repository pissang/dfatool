define(function(require, exports, module){
	
	var hub = require("hub"),
		esprima = require("esprima"),
		dfatool = require("dfatool"),
		ko = require("knockout")

	var $wrapper,
		styleNode;

	subscribeHubEvents();

	function load( _$wrapper ){

		$wrapper = _$wrapper;
		
		// load less file
		b_core.loadLess( require.toUrl('./context.less'), function(_styleNode){
			styleNode = _styleNode;
		} );
		b_core.loadTemplate( require.toUrl('./context.html'), function(tpl){
			$wrapper.html( tpl );
			init();
		} )
	}

	function unload(){
		if( styleNode ){
			$(styleNode).remove();
		}
		if( $wrapper ){
			$wrapper.remove();
		}
	}

	function subscribeHubEvents(){

		hub.subscribe("parsecode", function(code){
			parseCode( code );
		})
		hub.subscribe("showcontext", function( line ){
			contextSnapshot(line);
		})
	}

	var viewModel,
		globalScope,
		currentScope;

	function init(){
		viewModel = {
			localVariables : ko.observableArray([])
		}
		ko.applyBindings(viewModel, $wrapper[0]);

		hub.publish("loaded:module", "context");
	}

	function parseCode( code ){
		try{
			var ast = esprima.parse( code, {
				loc :true
			})
		}catch(e){
			return;
		}
		globalScope = new dfatool.newGlobalScope();
		dfatool.buildScope(ast, globalScope);

		globalScope.initialize();
		globalScope.derivation(1);

	}

	function contextSnapshot( line ){
		currentScope = globalScope;
		viewModel.localVariables.removeAll();
		for(var name in currentScope._defines){
			var variable = currentScope._defines[name];
			var value = variable.inference( currentScope.offsetLoc({
				line : line+1,
				column : 0
			}) );
			viewModel.localVariables.push( createValViewModel(variable.name, value) );
		}

		G.$app.addClass("active-sidebar");
	}

	function createValViewModel(name, val){
		var valVM = {
			name : name,
			isUndefined : val ? false : true,
			val : ko.observable(val.toJSON())
		}
		valVM.type = ko.computed(function(){
			var value = this.val();
			if( value.type == "literal"){
				return value.type;
			}else{
				return value.type;
			}
		}, valVM);
		valVM.value = ko.computed(function(){
			var value = this.val();
			if( value.type == "array"){
				return "[...]";
			}
			else if( value.type == "object"){
				return "{...}";
			}
			else if( value.type == "function"){
				return "[Function]";
			}
			else{
				return value.value;
			}
		}, valVM);
		return valVM;
	}

	exports.load = load;
	exports.unload = unload;
})