define(function(require, exports, module){

	var hub = require("hub");
	var ko	= require("knockout");
	ko.mapping = require("ko.mapping");

	router = Router({

		"/codechunks" : {
			on : function(){
				if( ! $("#Editor")[0] ){
					loadOneRow("editor");
				}
			},
			"/:code" : {
				on : function( code ){
					hub.publish("showcode:fromurl", code);
				}
			}
		}

	})

	function loadOneRow( moduleName ){

		hub.publish("module:unloadfromtpl", ".column-2", function(){

			var $main = $(".column-2");
				
			$main.html( $("#template-one-row").html() );
			var $wrapper = $main.find(".wrapper");
			
			$wrapper.append( createModuleTemplate(moduleName) );
			
			hub.publish("module:loadfromtpl", ".column-2");
		})
	}

	function createModuleTemplate( moduleName ){
		var tpl = '<div class="module" data-module="'+moduleName+'" />';
		var $tpl = $(tpl);
		$tpl.attr("id", moduleName.substr(0,1).toUpperCase() + moduleName.substr(1) );
		return $tpl;
	}

	hub.subscribe("redirect", function(url){
		router.setRoute( url );
	})

	router.configure({
		on : function(){
			hub.publish("route", window.location.hash);
		},
		recurse : "forward"
	})

	exports.start = function(){

		router.init( "/codechunks" );
	}

	exports.redirect = function(url){
		router.setRoute( url );
	}
})