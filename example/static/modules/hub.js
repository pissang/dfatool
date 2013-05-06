define( function(require, exports, module){

	var _registers = {};

	exports.publish = function(){

		var name = arguments[0];
		var params = Array.prototype.slice.call( arguments, 1 );

		var handlers = _registers[ name ];
		if( handlers ){
			handlers.forEach(function(handler){
				handler.apply( window, params );
			})
		}
	}

	exports.subscribe = function( target, handler ){

		if( ! target){
			return;
		}
		if( ! _registers[target] ){
			_registers[target] = [];
		}
		if( _registers[target].indexOf(handler) == -1){
			_registers[target].push( handler );
		}
	}

} )