require('geocomplete');
var map = require('./map.js');

var search = {
    init: function() {
        
        $('#searchform').submit(function(ev){
            ev.preventDefault();
        });
        
        $("#searchbar").geocomplete().bind("geocode:result", function(event, result){
            map.map.setView([result.geometry.location.lat(),result.geometry.location.lng()],12);
        });
        
        
        
        /*
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src  = "http://maps.googleapis.com/maps/api/js?libraries=places";
        window.gmap_draw = function(){
            alert ("Callback code here");
            
        };
        $("head").append(s);
        */
    }
};

module.exports = search;