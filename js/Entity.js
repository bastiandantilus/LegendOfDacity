EntityClass = Class.extend({
    // can all be referenced by child classes
    pos : {x:0,y:0},
    size : {x:0,y:0},
    last : {x:0,y:0},
    currSpriteName : null,
    zindex: 0,
    init : function() { },
    // can all be overloaded by child classes
    update : function() { },

    //-----------------------------------------
    draw : function() { }
});