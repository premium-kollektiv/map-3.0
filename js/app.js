
var map = require('./map.js');
var session = require('./session.js');
var search = require('./search.js');

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

