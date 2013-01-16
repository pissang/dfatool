define(function(require, exports, module){
	
	var hub = require("hub");

	var $wrapper,
		styleNode,
		themeStyleNode;

	var codemirror,
		codeSv = "",
		globalScope;

	var defaultCodeHint = "//type your code here \n\
//or select the test code on the left\n\
var foo = 20;\n\
var bar = foo-10;\n\
"

	var breakpointLine;

	subscribeHubEvents();

	function load( _$wrapper ){

		$wrapper = _$wrapper;
		
		// load less file
		b_core.loadLess( require.toUrl('./editor.less'), function(_styleNode){
			styleNode = _styleNode;
		} );
		b_core.loadTemplate( require.toUrl('./editor.html'), function(tpl){
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

	function init(){
		loadCodeEditor();
	}

	function loadCodeEditor(){
		$LAB.script("codemirror/codemirror.js")
		.script( "codemirror/mode/javascript.js")
		.wait( function(){
			codemirror = CodeMirror($wrapper.find('.editor')[0], {
				mode : "javascript",
				lineNumbers : true,
				gutters: ["breakpoints", "CodeMirror-linenumbers"]
			} );
			codemirror.on("gutterClick", function(cm, line){
				breakpointAt( line )
			});
			codemirror.on("change", function(cm){
				hub.publish("parsecode", cm.getValue());
				hub.publish("showcontext", breakpointLine)
			})
			codemirror.setValue(codeSv || defaultCodeHint);

			loadTheme("monokai");
		})
		b_core.loadCSS( window["LIB_PATH"] + "codemirror/codemirror.css", function(style){
			styleNode = style;
		})
	}

	function loadTheme( name ){
		b_core.loadCSS( window["LIB_PATH"] + "codemirror/theme/"+name+".css", function(style){
			$(themeStyleNode).remove();
			themeStyleNode = style;

			codemirror.setOption("theme", name);
		})
	}

	function breakpointAt(line){
		if( breakpointLine ){
			// remove the previous breakpoint info;
			codemirror.removeLineClass(breakpointLine, "background", "highlight-line");
			codemirror.clearGutter("breakpoints");
		}
		var $marker = $('<div class="breakpoint"></div>');
		codemirror.setGutterMarker( line, "breakpoints", $marker[0] );
		codemirror.addLineClass( line, "background", "highlight-line");
		breakpointLine = line;

		hub.publish("showcontext", line);
	}

	function subscribeHubEvents(){

		hub.subscribe("showcode:fromurl", function(url){
			$.get("../cases/"+url+".js", function(code){
				if( ! codemirror ){
					// show code after the codemirror is loaded
					codeSv = code;
				}else{
					codemirror.setValue( code );
					codeSv = "";
				}
				hub.publish("parsecode", code)
			}, "text");
		});

	}

	exports.load = load;
	exports.unload = unload;
})