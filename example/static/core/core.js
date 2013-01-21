/**
 * Core.js
 */
var b_core = b_core || {};

b_core.loadLess = function( url, callback ){

	b_core.get( url, function( result ){

		// parse less
		(new less.Parser()).parse( result, function(err, css){

			if( err ){
				b_core.error( msg );
			}else{
				var style = document.createElement('style');
				style.type = 'text/css';
				style.textContent = css.toCSS();

				document.head.appendChild(style);

				callback && callback( style );
			}

		} )
	}, 'text' );

}

b_core.loadCSS = function( url, callback ){

	b_core.get( url, function( result ){

		var style = document.createElement('style');
		style.type = 'text/css';
		style.textContent = result;

		document.head.appendChild(style);

		callback && callback( style );
	}, "text" )
}

b_core.loadTemplate = function( url, callback ){

	b_core.get( url, function(tpl){

		callback && callback(tpl);

	}, 'text');
}

b_core.error = function( msg ){

	if(typeof console !== 'undefined' && console.error){
		console.error( msg );
	}
}

b_core.warn = function( msg ){

	if(typeof console !== 'undefined' && console.warn){
		console.warn( msg );
	}
}

// from underscore.js
b_core.extend = function(obj){
	Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
}

b_core.convertForm = function(arr){
	var params = {};
	for( var i = 0; i < arr.length; i++ ){
		params[arr[i].name] = arr[i].value;
	}
	return params;
}

b_core.get = $.get;
b_core.post = $.post;

