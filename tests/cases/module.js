var Module = function(){
    // private
    var privateProp = 10;
    var privateMethod = function(){
        doSomething();
    }
    // public
    var publicProp = 10;
    var publicMethod = function(){
        doSomething();
    }

    if( privateProp == 10){
        publicProp = privateProp;
    }
    return {
        prop : publicProp,
        method : publicMethod
    }
};
var module = Module();