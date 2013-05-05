function foo(arg){
    if( arg == "first"){
        return "first";
    }else if(arg=="second"){
        return "second";
    }else{
        return "third";
    }
}
var first = foo("first");
var second = foo("second");
var third = foo("third");