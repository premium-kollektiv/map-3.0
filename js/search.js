require('geocomplete');
var map = require('./map.js');

var search = {
    init: function() {
        
        // fix for lazy loading gapi
        window.gcallback = function() {
            search.gcallback();
        }
        
        
        $.getScript('//maps.googleapis.com/maps/api/js?libraries=places&language=de&callback=gcallback',function(){
            
        });	
    },
    
    gcallback: function() {
        
        $("#searchbar").geocomplete().bind("geocode:result", function(event, result){
            
            search.setViewport(result);
        });
    },
    
    setViewport: function(result) {
        
        //console.log(result);
            //map.map.fitBounds();
            //map.map.setView([result.geometry.location.lat(),result.geometry.location.lng()],12);
            if (result.geometry.viewport != undefined) {
                map.map.fitBounds([[result.geometry.viewport.getSouthWest().lat(),
                        result.geometry.viewport.getSouthWest().lng()],
                    [result.geometry.viewport.getNorthEast().lat(),
                        result.geometry.viewport.getNorthEast().lng()]]);
                //map.map.setZoom(18);
            } else if (result.geometry.bounds != undefined) {
                map.fitBounds([[result.geometry.bounds.getSouthWest().lat(),
                        result.geometry.bounds.getSouthWest().lng()],
                    [result.geometry.bounds.getNorthEast().lat(),
                        result.geometry.bounds.getNorthEast().lng()]]);
            } else { // give up, pick an arbitrary zoom level
                map.map.setView([result.geometry.location.lat(),result.geometry.location.lng()],15);
            }
        
    }
};

module.exports = search;