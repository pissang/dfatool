function hyber(){
	var foo = 1;

	function outer(){
		foo = 2;
		function inner(){
			return foo;
		}
		return inner();
	}
	return outer()
}

var bar = hyber();