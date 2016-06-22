
/*
 * requirements
 */

var session = require('./session.js');
require('leaflet.markercluster');

/*
 * some data for map data
 */
ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>';
MB_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + ACCESS_TOKEN;
OSM_URL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
OSM_ATTRIB = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/*
 * map object to privide all premium map functions
 */
var map = {
    
    map: null,
    
    marker: null,
    
    /*
     * kick off
     */
    init:function(){
        
        /*
         * initiate map
         */
        L.Icon.Default.imagePath = '/img/marker';
        this.map = L.map('map',{zoomControl:false});
        
        /*
         * marker setup
         */
        
        
        
        /*
         * add tile layers
         */
        L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'mapbox.streets'}).addTo(this.map);
        new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);

        /*
         * save state in session while browsing
         */
        this.map.on('zoomend', function(){
            map.saveState()
        });
        this.map.on('moveend', function(){
            map.saveState()
        });
        
        /*
         * check if therre is a state saved in session go to last state
         * otherwise center to germany and try to locate by browser
         * 
         */
        var state = session.get('state');
        
        if(state != undefined) {
            
            this.map.setView(state.center, state.zoom);
            
        } else {
            
           /*
            * set map in center of germany
            */
           this.map.setView([50.93766174471314,9.777832031250002], 6);

           /*
            * try to locate user
            */
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(function(position){
                   console.log(position);
                   map.map.setView([position.coords.latitude, position.coords.longitude], 12);
               });
           }
        }
    },
    
    saveState: function() {
        session.set('state',{
           zoom: map.map.getZoom(),
           center: map.map.getCenter()
        });
        
        console.log(session.get('state'));
    },
    
    loadMarker: function() {
        loader.start();
        
        $.ajax({
            url: '/MOCK_DATA_SIMPLE.json',
            dataType: 'json',
            success: function(data) {
                var markers = L.markerClusterGroup();

                for(i=0;i<data.length;i++) {
                    //console.log(data[i].id);
                    
                    var latlng = [parseFloat(data[i].lat),parseFloat(data[i].lng)];
                    
                    markers.addLayer(new L.marker(getRandomLatLng(map.map)));
                }
                
                map.map.addLayer(markers);
                
            },
            complete: function() {
                loader.stop();
            }
        });
        
    }
};


function getRandomLatLng(map) {
			var bounds = map.getBounds(),
				southWest = bounds.getSouthWest(),
				northEast = bounds.getNorthEast(),
				lngSpan = northEast.lng - southWest.lng,
				latSpan = northEast.lat - southWest.lat;

			return new L.LatLng(
					southWest.lat + latSpan * Math.random(),
					southWest.lng + lngSpan * Math.random());
}

module.exports = map;