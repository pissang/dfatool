var mod = (function(){
    var foo = 10;
    return {
        set : function(v){
            foo = v;
        },
        get : function(){
            return foo;
        }
    }
})()

mod.set(20);
var result = mod.get();
