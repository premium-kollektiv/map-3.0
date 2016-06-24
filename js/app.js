
var session = require('./session.js');
var search = require('./search.js');
var map = require('./map.js');

/*
 * main app to handle objects
 */
var app = {
    init: function() {
        popup.init();
        
        loader.init();
        
        if($('#map').length > 0) {
           map.init(); 
        }
        
        if($('#searchbar').length > 0) {
            search.init();
        }
        
        map.loadMarker();
        
        
    }
};



$(document).ready(function(){
    
    app.init();
    
});

