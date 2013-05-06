function getObject(){
	return {
		a : {
			c : 2
		}
	}
}
var c = getObject();
var b = 'a';
c[b]['c'] = 10;