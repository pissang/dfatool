define(function(require, exports, module){
	
	var ko = require("knockout");
	var hub = require("hub")

	var $wrapper,
		styleNode;

	var viewModel = {
		menu : [
			{
				href : "#/codechunks",
				icon : "icon codechunks",
				name : "Code chunks",
				active : ko.observable(true),
				submenu : generateCodeChunksMenu()
			}
		]
	}

	function load( _$wrapper ){

		$wrapper = _$wrapper;
		
		// load less file
		b_core.loadLess( require.toUrl('./navigator.less') );
		b_core.loadTemplate( require.toUrl('./navigator.html'), function(tpl){
			
			$wrapper.html( tpl );

			init();

			subscribeHubEvents();
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

	function init(){

		ko.applyBindings(viewModel, $wrapper[0]);
		activeMenu( window.location.hash );
	}

	function subscribeHubEvents(){
		hub.subscribe("route", function(href){
			activeMenu(href);
		})
	}

	function activeMenu( href ){
		traverseMenu( viewModel.menu, function(node){
			if( href == node.href ||
				// active parent node
				href.substr(2).split("/").indexOf(node.href.substr(2)) >= 0 ){
				node.active(true);
			}else{
				node.active(false);
			}
		})	
	}

	function traverseMenu(list, callback){
		if( list && list.length ){
			for(var i = 0; i < list.length; i++){
				callback( list[i] );
				traverseMenu( list[i].submenu, callback );
			}
		}
	}

	function generateCodeChunksMenu(){
		var list = [
			"anoymous_namespace",
			"array",
			"circular_reference",
			"closure",
			"complex_access_path",
			"conditional_statement2",
			"conditional_statement",
			"expression_evaluate",
			"function_call",
			"high_order_function",
			"modify_object",
			"module",
			"namespace",
			"nesting_function",
			"new_expression",
			"recursive_call",
			"simple_assign",
			"switch_statement"
		];
		var ret = []
		for(var i = 0; i < list.length; i++){
			ret.push({
				href : "#/codechunks/"+list[i],
				active : ko.observable(false),
				name : list[i]
			})
		}
		return ret;
	}

	exports.load = load;
	exports.unload = unload;
})