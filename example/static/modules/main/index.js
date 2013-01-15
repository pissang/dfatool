/**
 * Main Module
 * 
 * *Mainly Load the app layout and other moudles needed for the app
 * *manage the route of the app
 */
define(function(require, exports, module){

	var $wrapper;

	var hub = require("hub");
	var router = require("./router");
	var async = require("async")

	var modulesCache = {}

	function load(_$wrapper){

		$wrapper = _$wrapper;
		// load less file
		b_core.loadLess( require.toUrl("./main.less") );
		// load template
		b_core.loadTemplate( require.toUrl('./main.html'), function( tpl){

			$wrapper.html( tpl );

			loadModulesFromTpl( $wrapper, require );
			
			hub.publish("module:loaded", "main");

			// init handler of events from sub
			subscribeHubEvents();
			// start router after the main module is loaded;
			router.start();
		} );
	}

	function loadModulesFromTpl($wrapper, callback){
		$wrapper = $($wrapper);
		var moduleDoms = $wrapper.find('.module').toArray();
		
		async.forEach(moduleDoms, function( moduleWrapperDom, callback ){
			var moduleName = $(moduleWrapperDom).data("module");
			
			loadModule( moduleName, $(moduleWrapperDom), callback);

		}, function(err){
			callback && callback( );
		})
	}

	function unloadModulesFromTpl($wrapper, callback){
		$wrapper = $($wrapper);
		var moduleDoms = $wrapper.find('.module').toArray();
		
		if( ! moduleDoms.length ){
			callback && callback();
			return;
		}

		async.forEach(moduleDoms, function( moduleWrapperDom, callback ){
			var moduleName = $(moduleWrapperDom).data("module");
			
			unloadModule( moduleName, callback);

		}, function(err){
			callback && callback( );
		})
	}

	function subscribeHubEvents(){
		hub.subscribe("module:load", loadModule);
		hub.subscribe("module:unload", unloadModule);
		hub.subscribe("module:loadfromtpl", loadModulesFromTpl);
		hub.subscribe("module:unloadfromtpl", unloadModulesFromTpl);
	}

	function loadModule( moduleName, $wrapper, callback ){
		require( ['../'+moduleName+'/index'], function(module){
			if( module ){
				if( module.load ){
					modulesCache[ moduleName ] = module;
					module.load( $wrapper );	//pass in the wrapper
				}else{
					b_core.error('Module "' + moduleName + '" has no load method' );
				}
			}else{
				b_core.error('Module "' + moduleName + '" is not defined');
			}
			
			callback( module );
		})
	}

	function unloadModule( moduleName, callback ){
		var module = modulesCache[moduleName];
		if( ! module){
			b_core.error('Module "' + moduleName + '" is not defined');
		}else if( ! module.unload){
			b_core.error('Module "' + moduleName + '" has no unload method' );
		}else{
			module.unload();
		}

		callback && callback();
	}

	exports.load = load;
})