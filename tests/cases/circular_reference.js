var module = function(){

    var foo = {};
    var bar = {};
    foo.prop = bar;
    bar.prop = foo;

    return {
        foo : foo,
        bar : bar
    }
}()